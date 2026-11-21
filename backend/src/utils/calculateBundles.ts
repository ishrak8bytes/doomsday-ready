type BundleResult = {
  possible: boolean;
  minimum: number | null;
  combination: Record<number, number> | null;
};

export function calculateBundles(
  target: number,
  bundles: number[]
): BundleResult {

  let best: BundleResult | null = null;

  // Maximum number of times each bundle can be used
  const limits = bundles.map(bundle =>
    Math.floor(target / bundle)
  );

  // Generate all possible combinations iteratively
  const counts = Array(bundles.length).fill(0);

  while (true) {

    // Calculate total seats
    let total = 0;

    for (let i = 0; i < bundles.length; i++) {
      total += counts[i] * bundles[i]!;
    }

    // Check if the combination matches the target
    if (total === target) {

      const bundleCount = counts.reduce(
        (sum, count) => sum + count,
        0
      );

      if (best === null || bundleCount < best.minimum!) {

        const combination: Record<number, number> = {};

        for (let i = 0; i < bundles.length; i++) {
          if (counts[i] > 0) {
            combination[bundles[i]!] = counts[i];
          }
        }

        best = {
          possible: true,
          minimum: bundleCount,
          combination
        };
      }
    }

    // Move to the next combination
    let i = 0;

    while (i < bundles.length) {
      if (counts[i] < limits[i]!) {
        counts[i]++;
        break;
      }

      counts[i] = 0;
      i++;
    }

    // All combinations have been exhausted
    if (i === bundles.length) {
      break;
    }
  }

  return best ?? {
    possible: false,
    minimum: null,
    combination: null
  };
}


// Testing
// console.log(calculateBundles(6, [1, 3, 4]));
// console.log(calculateBundles(11, [2, 5]));
// console.log(calculateBundles(44, [6, 9, 20]));
// console.log(calculateBundles(7, [4, 6]));

