export async function initAndFetch() {
  const BranchSDK = (await import('branch-sdk')).default;

  BranchSDK.init(process.env.NEXT_PUBLIC_BRANCH_KEY);

  BranchSDK.data(function (err, data) {
    if (err) {
      console.warn(`Branch failed to resolve link: ${err}`);
      return;
    }
    console.log('opened branch link');
  });
}

export async function logPurchaseEvent(eventParams) {
  const BranchSDK = (await import('branch-sdk')).default;

  var event_and_custom_data = {
    transaction_id: eventParams['transaction_id'],
    currency: 'GBP',
    revenue: eventParams['amount'],
    coupon: eventParams['coupon'],
  };
  BranchSDK.logEvent(
    'PURCHASE',
    event_and_custom_data,
    eventParams['content_items'],
    function (err) {
      console.log(err);
    }
  );
}
