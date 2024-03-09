class EligibilityService {
  /**
   * Check conditions:
   *  - gt
   *  - lt
   *  - gte
   *  - lte
   *  - in
   *
   * @param condition
   * @param value
   * @param cartFieldValue
   * @return {boolean}
   */
  checkConditionGtLtGteLteIn(condition, value, cartFieldValue) {
    if (condition === 'gt') {
      return cartFieldValue > value;
    }
    if (condition === 'lt') {
      return cartFieldValue < value;
    }
    if (condition === 'gte') {
      return cartFieldValue >= value;
    }
    if (condition === 'lte') {
      return cartFieldValue <= value;
    }
    if (condition === 'in') {
      return value.includes(cartFieldValue);
    }

    return false;
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
    if (Object.keys(criteria).length === 0) {
      return true;
    }

    // Retrieve the entries of criteria
    const criteriaEntries = Object.entries(criteria);
    const [criteriaKey, criteriaValue] = criteriaEntries[0];
  
    // Basic condition
    if (!(criteriaValue instanceof Object)) {
      return cart[criteriaKey] == criteriaValue;
    }

    // Other conditions
    const criteriaValueEntries = Object.entries(criteriaValue);
    const [condition, value] = criteriaValueEntries[0];
    if (['gt', 'lt', 'gte', 'lte', 'in'].includes(condition)) {
      return this.checkConditionGtLtGteLteIn(condition, value, cart[criteriaKey]);
    }

    return false;
  }
}

module.exports = {
  EligibilityService,
};
