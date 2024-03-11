class EligibilityService {
  /**
     * Check conditions except basic and sub-object.
     *
     * @param condition
     * @param value
     * @param cartFieldValue
     * @return {boolean}
     */
  checkConditionExceptBasicSubobject(condition, value, cartFieldValue) {
    switch (condition) {
      case 'gt':
        return cartFieldValue > value;
      case 'lt':
        return cartFieldValue < value;
      case 'gte':
        return cartFieldValue >= value;
      case 'lte':
        return cartFieldValue <= value;
      case 'in':
        return value.includes(cartFieldValue);
      case 'and': {
        const that = this;
        const conditionValueEntries = Object.entries(value);
        return conditionValueEntries.every(function ([subCondition, subValue]) {
          return that.checkConditionExceptBasicSubobject(subCondition, subValue, cartFieldValue);
        });
      }
      case 'or': {
        const that = this;
        const conditionValueEntries = Object.entries(value);
        return conditionValueEntries.some(function ([subCondition, subValue]) {
          return that.checkConditionExceptBasicSubobject(subCondition, subValue, cartFieldValue);
        });
      }
      default:
        return false;
    }
  }

  /**
   * Check Basic condition.
   *
   * @param criteriaValue
   * @param cartFieldValue
   * @return {boolean}
   */
  checkConditionBasic(criteriaValue, cartFieldValue) {
    return cartFieldValue == criteriaValue;
  }

  /**
   * Check Sub-object condition.
   *
   * @param criteriaKey
   * @param criteriaValueOrObject
   * @return {boolean}
   */
  checkConditionSubobject(criteriaKey, criteriaValueOrObject, cart) {
    const that = this;
    const [cartField, cartSubField] = criteriaKey.split('.');
    if (!cart[cartField]) {
      return false;
    }
    const cartFieldAsArray = Array.isArray(cart[cartField]) ? cart[cartField] : [cart[cartField]];
    if (!(criteriaValueOrObject instanceof Object)) {
      return cartFieldAsArray.some(function (cartFieldValue) {
        return that.checkConditionBasic(criteriaValueOrObject, cartFieldValue[cartSubField]);
      });
    }
    const criteriaValueOrObjectEntries = Object.entries(criteriaValueOrObject);
    return criteriaValueOrObjectEntries.every(function ([condition, value]) {
      return cartFieldAsArray.some(function (cartFieldValue) {
        return that.checkConditionExceptBasicSubobject(condition, value, cartFieldValue[cartSubField]);
      });
    })
  }

  /**
   * Compare cart data with criteria to compute eligibility.
   * If all criteria are fulfilled then the cart is eligible (return true).
   *
   * @param cart
   * @param criteria
   * @return {boolean}
   */
  isEligible(cart, criteria) {
    const that = this;

    // Retrieve the entries of criteria
    const criteriaEntries = Object.entries(criteria);

    // Loop on the entries of criteria: all conditions must be fullfilled if cart is eligible
    return criteriaEntries.every(function ([criteriaKey, criteriaValueOrObject]) {
      // Sub-Object condition
      if (criteriaKey.indexOf('.') > -1) {
        return that.checkConditionSubobject(criteriaKey, criteriaValueOrObject, cart);
      }

      // Basic condition
      if (!(criteriaValueOrObject instanceof Object)) {
        return that.checkConditionBasic(criteriaValueOrObject, cart[criteriaKey]);
      }

      // Other conditions
      const criteriaValueEntries = Object.entries(criteriaValueOrObject);
      return criteriaValueEntries.every(function ([condition, value]) {
        return that.checkConditionExceptBasicSubobject(condition, value, cart[criteriaKey]);
      });
    });
  }
}

module.exports = {
  EligibilityService,
};
