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

    return false;
  }
}

module.exports = {
  EligibilityService,
};
