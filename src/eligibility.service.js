class EligibilityService {
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
    const [, value] = criteriaValueEntries[0];
    return cart[criteriaKey] > value;
  }
}

module.exports = {
  EligibilityService,
};
