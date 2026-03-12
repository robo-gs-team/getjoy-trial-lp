const fs = require('fs');
let html = fs.readFileSync('pdp_local.html', 'utf-8');

// ===== FIX: SIZE selector =====
// The SIZE selector fieldset has id prefix "HNzyGi2LB5yhxn8s"
// Currently has: Chicken and Beef radio inputs/labels
// Need to change to: Trial (4oz), Small (16oz), Large (32oz)

// 1. Fix the SIZE selector's first option: Chicken -> Trial (4oz)
html = html.replace(
  'id="HNzyGi2LB5yhxn8s-1-0" value="Chicken"',
  'id="HNzyGi2LB5yhxn8s-1-0" value="Trial (4oz)"'
);
html = html.replace(
  'for="HNzyGi2LB5yhxn8s-1-0" class="i48EgDwSWANSAtKLz" title="Chicken" aria-checked="true">\n                        Chicken\n                      </label>',
  'for="HNzyGi2LB5yhxn8s-1-0" class="i48EgDwSWANSAtKLz" title="Trial (4oz)" aria-checked="true">\n                        Trial (4oz)\n                      </label>'
);

// 2. Fix the SIZE selector's second option: Beef -> Small (16oz)
html = html.replace(
  'id="HNzyGi2LB5yhxn8s-1-1" value="Beef"',
  'id="HNzyGi2LB5yhxn8s-1-1" value="Small (16oz)"'
);
html = html.replace(
  'for="HNzyGi2LB5yhxn8s-1-1" class="i48EgDwSWANSAtKLz" title="Beef">\n                        Beef\n                      </label>',
  'for="HNzyGi2LB5yhxn8s-1-1" class="i48EgDwSWANSAtKLz" title="Small (16oz)">\n                        Small (16oz)\n                      </label>'
);

// 3. Add a third option: Large (32oz) - insert after the Beef/Small label
const thirdOption = '<input id="HNzyGi2LB5yhxn8s-1-2" value="Large (32oz)" name="YLfHdW0EqoHqsrgH_HNzyGi2LB5yhxn8s__Flavor" type="radio">\n                      <label for="HNzyGi2LB5yhxn8s-1-2" class="i48EgDwSWANSAtKLz" title="Large (32oz)">\n                        Large (32oz)\n                      </label>';

// Insert before the closing </fieldset> of the SIZE selector
html = html.replace(
  'Small (16oz)\n                      </label>\n                    </fieldset>',
  'Small (16oz)\n                      </label>\n                      ' + thirdOption + '\n                    </fieldset>'
);

// 4. Change the SIZE label from "1 LB" to "Trial (4oz)" (the selected display value)
html = html.replace(
  'data-instant-dynamic-content-source="OPTION2" data-instant-type="text" class="iyiosv1NCpqg6tZWi">1 LB</p>',
  'data-instant-dynamic-content-source="OPTION2" data-instant-type="text" class="iyiosv1NCpqg6tZWi">TRIAL (4OZ)</p>'
);

// 5. Change "FLAVOR:" label to just "FLAVOR:" and keep Chicken/Beef as-is
// The FLAVOR section looks correct, just needs the displayed value updated
// "FLAVOR: CHICKEN" - keep as is since it's the correct selector

console.log('Size selector fixes applied');

fs.writeFileSync('pdp_local.html', html, 'utf-8');
console.log('Saved. File size:', html.length);
