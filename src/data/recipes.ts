export interface Ingredient {
  item: string;
  amount: number;
  unit: string;
  metricAmount?: number;
  metricUnit?: string;
  note?: string;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  chefTip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  frenchTitle: string;
  category: 'French Patisserie' | 'Cakes & Gateaux' | 'Tartes & Viennoiserie' | 'Custards & Spoon Desserts' | 'Cookies & Confections';
  emoji: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master Baker';
  prepTime: string;
  bakeTime: string;
  chillTime?: string;
  servings: number;
  description: string;
  tags: string[];
  equipment: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  proTips: string[];
  associatedQuizId?: string;
  caloriesPerServing?: number;
}

export const RECIPE_CATEGORIES = [
  'All Sweets',
  'French Patisserie',
  'Cakes & Gateaux',
  'Tartes & Viennoiserie',
  'Custards & Spoon Desserts',
  'Cookies & Confections',
] as const;

export const RECIPES_DATA: Recipe[] = [
  {
    id: 'parisian-chocolate-eclairs',
    title: 'Parisian Chocolate Éclairs',
    frenchTitle: 'Éclairs au Chocolat Valrhona',
    category: 'French Patisserie',
    emoji: '🥐',
    difficulty: 'Advanced',
    prepTime: '55 mins',
    bakeTime: '35 mins',
    chillTime: '2 hours',
    servings: 12,
    description: 'Crisp, golden choux pastry shells piped to perfection, filled with silky dark chocolate crème pâtissière, and dipped in a high-gloss chocolate mirror fondant.',
    tags: ['Choux Pastry', 'Valrhona', 'Pastry Cream', 'Mirror Glaze', 'French Classic'],
    associatedQuizId: 'quiz-pastry-fundamentals',
    caloriesPerServing: 320,
    equipment: ['Large piping bag with French star tip PF16', 'Perforated baking mat or parchment', 'Whisk & silicone spatula', 'Candy thermometer'],
    ingredients: [
      { item: 'Whole milk', amount: 125, unit: 'ml', metricAmount: 125, metricUnit: 'ml' },
      { item: 'Filtered water', amount: 125, unit: 'ml', metricAmount: 125, metricUnit: 'ml' },
      { item: 'European unsalted butter (cut into cubes)', amount: 100, unit: 'g', metricAmount: 100, metricUnit: 'g' },
      { item: 'Granulated sugar', amount: 10, unit: 'g', metricAmount: 10, metricUnit: 'g' },
      { item: 'Fine sea salt', amount: 3, unit: 'g', metricAmount: 3, metricUnit: 'g' },
      { item: 'T55 French pastry flour (or unbleached bread flour)', amount: 150, unit: 'g', metricAmount: 150, metricUnit: 'g' },
      { item: 'Large eggs (room temperature, lightly beaten)', amount: 4, unit: 'large', metricAmount: 200, metricUnit: 'g' },
      { item: 'Heavy whipping cream (for filling)', amount: 500, unit: 'ml', metricAmount: 500, metricUnit: 'ml' },
      { item: '70% Valrhona Guanaja dark chocolate (chopped)', amount: 180, unit: 'g', metricAmount: 180, metricUnit: 'g' },
      { item: 'Egg yolks (for pastry cream)', amount: 4, unit: 'yolks', metricAmount: 70, metricUnit: 'g' },
      { item: 'Cornstarch (corn flour)', amount: 40, unit: 'g', metricAmount: 40, metricUnit: 'g' },
      { item: 'Tahitian vanilla bean (split & scraped)', amount: 1, unit: 'pod', metricAmount: 1, metricUnit: 'pod' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Prepare the Choux Panade',
        instruction: 'Combine milk, water, diced butter, sugar, and salt in a heavy saucepan. Bring to a rapid rolling boil over medium-high heat so butter is fully melted when liquid boils. Remove from heat and dump in all sifted flour at once. Vigorously stir with a wooden spatula until a smooth dough mass forms.',
        chefTip: 'Dry out the panade over medium heat for 90 seconds while constantly pressing against the bottom until a thin white starchy film coats the pan floor.'
      },
      {
        stepNumber: 2,
        title: 'Incorporate Eggs to "V" Ribbon',
        instruction: 'Transfer hot dough to a stand mixer fitted with the paddle attachment. Mix on low speed for 2 minutes to steam off excess moisture until cooled to 45°C (113°F). Gradually pour in beaten eggs in 4 additions, beating thoroughly after each addition until fully absorbed.',
        chefTip: 'Stop when the dough hangs off the paddle in a glossy, smooth, triangular "V" ribbon.'
      },
      {
        stepNumber: 3,
        title: 'Pipe & Bake Éclairs',
        instruction: 'Preheat oven to 180°C (355°F) static heat. Fit a pastry bag with a French star tip (PF16) and pipe 12 cm (4.7 inch) fingers onto a perforated baking mat spaced 2 inches apart. Lightly dust with powdered sugar or cocoa butter spray. Bake undisturbed for 35 to 40 minutes until deeply golden and hollow.',
        chefTip: 'Never open the oven door during the first 25 minutes or the steam-expanded hollow pockets will collapse instantly!'
      },
      {
        stepNumber: 4,
        title: 'Cook Chocolate Crème Pâtissière',
        instruction: 'Whisk egg yolks, sugar, and cornstarch in a bowl until pale. Heat milk with scraped vanilla bean to a simmer. Slowly stream half hot milk into yolks while whisking, then pour all back into saucepan. Cook over medium heat, whisking furiously until boiling and thick. Remove from heat, whisk in chopped chocolate until glossy and melted, press plastic wrap directly to surface and chill.',
        chefTip: 'Whisk the chilled cream vigorously before piping to restore its velvety, pipeable emulsion.'
      },
      {
        stepNumber: 5,
        title: 'Fill & Mirror Glaze',
        instruction: 'Poke 3 small holes into the base of each cooled éclair shell using a small round nozzle. Generously pipe chocolate cream until heavy and filled. Warm chocolate mirror glaze to 32°C (90°F) and gently dip the top curved crown of each éclair. Wipe excess with your thumb and allow to set in the boutique display.',
        chefTip: 'Garnish with a tiny pinch of gold leaf or crunchy cocoa nibs for patisserie luxury.'
      }
    ],
    proTips: [
      'Using a French star tip (grooved nozzle) prevents éclairs from cracking or bursting during baking by creating score lines that expand evenly.',
      'Always weigh your eggs! If dough is too wet, éclairs spread flat; if too dry, they do not puff into hollow chambers.'
    ]
  },
  {
    id: 'parisian-raspberry-rose-macarons',
    title: 'Raspberry Rose Parisian Macarons',
    frenchTitle: 'Macarons Ispahan à la Framboise & Rose',
    category: 'French Patisserie',
    emoji: '🍓',
    difficulty: 'Advanced',
    prepTime: '1 hour 15 mins',
    bakeTime: '14 mins',
    chillTime: '24 hours (maturation)',
    servings: 24,
    description: 'Delicate pastel pink almond meringue shells featuring crisp ruffled "pieds" (feet), sandwiching a fragrant white chocolate rosewater ganache and fresh ruby raspberry compote.',
    tags: ['Macarons', 'Almond Flour', 'Italian Meringue', 'Rosewater', 'French Elegance'],
    associatedQuizId: 'quiz-cookies-confections',
    caloriesPerServing: 145,
    equipment: ['Food processor & fine mesh sieve', 'Stand mixer with whisk attachment', 'Candy thermometer', 'Silicone macaron stencil mats', 'Piping bag with 8mm round tip'],
    ingredients: [
      { item: 'Fine blanched almond flour (sifted)', amount: 150, unit: 'g', metricAmount: 150, metricUnit: 'g' },
      { item: 'Confectioners powdered sugar', amount: 150, unit: 'g', metricAmount: 150, metricUnit: 'g' },
      { item: 'Aged egg whites (split into two 55g bowls)', amount: 110, unit: 'g', metricAmount: 110, metricUnit: 'g' },
      { item: 'Granulated sugar (for syrup)', amount: 150, unit: 'g', metricAmount: 150, metricUnit: 'g' },
      { item: 'Mineral water', amount: 37, unit: 'ml', metricAmount: 37, metricUnit: 'ml' },
      { item: 'Powdered pink or magenta food color', amount: 1, unit: 'pinch', metricAmount: 1, metricUnit: 'pinch' },
      { item: 'Valrhona Opalys 33% white chocolate', amount: 180, unit: 'g', metricAmount: 180, metricUnit: 'g' },
      { item: 'Heavy whipping cream (35% fat)', amount: 90, unit: 'ml', metricAmount: 90, metricUnit: 'ml' },
      { item: 'Culinary Damascus rosewater essence', amount: 1, unit: 'tsp', metricAmount: 5, metricUnit: 'ml' },
      { item: 'Fresh seedless raspberry preserve', amount: 60, unit: 'g', metricAmount: 60, metricUnit: 'g' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Tant-pour-Tant & Sugar Syrup',
        instruction: 'Pulse almond flour and confectioners sugar in food processor for 10 seconds, then pass through a fine sieve twice (this mixture is your Tant-pour-Tant). Add the first 55g of raw egg whites and pink food coloring directly on top to create a thick paste without mixing yet. In a saucepan, bring water and granulated sugar to 118°C (244°F).',
        chefTip: 'Never over-process almond flour or the oils will release, resulting in oily, hollow macaron shells.'
      },
      {
        stepNumber: 2,
        title: 'Cook Glossy Italian Meringue',
        instruction: 'When sugar syrup reaches 110°C, begin whipping second 55g egg whites to soft peaks on medium speed. Once syrup reaches 118°C, pour in a thin steady stream down the inside wall of the mixer bowl with beaters running on high. Whisk until stiff, glossy, and cooled to body temperature (40°C).',
        chefTip: 'The meringue should display a majestic bird beak (bec d’oiseau) curve when the whisk is lifted.'
      },
      {
        stepNumber: 3,
        title: 'The Macaronage Technique',
        instruction: 'Fold 1/3 of the Italian meringue into the almond paste to loosen it. Gently fold in remaining meringue with a silicone spatula, scraping along the bottom and wiping around the sides while rotating bowl, pressing against the sides to knock out excess air.',
        chefTip: 'Stop immediately when the batter cascades off the spatula in an unbroken glossy ribbon that slowly re-absorbs into itself in 25 to 30 seconds.'
      },
      {
        stepNumber: 4,
        title: 'Piping & The Crucial Crust',
        instruction: 'Pipe 3.5 cm discs onto baking mats. Firmly rap the baking sheet flat onto the counter 4 times to release trapped bubbles (pop any remaining surface bubbles with a toothpick). Rest uncovered at room temperature for 30 to 45 minutes until a dull, dry skin forms that does not stick to a gentle touch.',
        chefTip: 'If your kitchen is humid, use a gentle desk fan blowing across the trays to speed up shell skin formation.'
      },
      {
        stepNumber: 5,
        title: 'Bake, Fill & 24h Maturation',
        instruction: 'Bake at 150°C (300°F) for 14 minutes. Allow to cool completely before peeling off mats. Pipe a ring of rose ganache onto half the shells, place a droplet of raspberry preserve in the center, and sandwich with matching shells. Refrigerate for 24 hours in a sealed container before tasting.',
        chefTip: 'The 24-hour maturation in the fridge is essential: moisture from the ganache migrates into the shell, creating the signature chewy, melt-in-your-mouth texture!'
      }
    ],
    proTips: [
      'Age your egg whites in the fridge for 24-48 hours, then bring to room temperature before whipping to break down albumen bonds for sturdier meringue.',
      'Always bake on stacked doubled baking sheets if your oven has strong bottom heat to ensure high, straight ruffled feet.'
    ]
  },
  {
    id: 'classic-mille-feuille-napoleon',
    title: 'Classic Mille-Feuille (Napoleon)',
    frenchTitle: 'Mille-Feuille Traditionnel à la Vanille Bourbon',
    category: 'French Patisserie',
    emoji: '🍰',
    difficulty: 'Master Baker',
    prepTime: '2 hours',
    bakeTime: '40 mins',
    chillTime: '4 hours',
    servings: 8,
    description: 'Three razor-sharp layers of caramelized, flaky thousand-leaf puff pastry interleaved with luscious Tahitian vanilla diplomat cream and feathered fondant icing.',
    tags: ['Puff Pastry', 'Inverted Dough', 'Diplomat Cream', 'Lamination', 'French Classic'],
    associatedQuizId: 'quiz-pastry-fundamentals',
    caloriesPerServing: 410,
    equipment: ['Rolling pin & ruler', 'Baking sheets with cooling racks as weights', 'Serrated pastry knife', 'Piping bag with round nozzle'],
    ingredients: [
      { item: 'Unbleached all-purpose flour', amount: 250, unit: 'g', metricAmount: 250, metricUnit: 'g' },
      { item: 'European 84% butter (for lamination beurrage)', amount: 200, unit: 'g', metricAmount: 200, metricUnit: 'g' },
      { item: 'Cold ice water', amount: 120, unit: 'ml', metricAmount: 120, metricUnit: 'ml' },
      { item: 'Fine sea salt', amount: 5, unit: 'g', metricAmount: 5, metricUnit: 'g' },
      { item: 'Whole milk', amount: 500, unit: 'ml', metricAmount: 500, metricUnit: 'ml' },
      { item: 'Bourbon vanilla beans (halved & scraped)', amount: 2, unit: 'pods', metricAmount: 2, metricUnit: 'pods' },
      { item: 'Egg yolks', amount: 5, unit: 'yolks', metricAmount: 90, metricUnit: 'g' },
      { item: 'Granulated sugar', amount: 100, unit: 'g', metricAmount: 100, metricUnit: 'g' },
      { item: 'Cornstarch', amount: 45, unit: 'g', metricAmount: 45, metricUnit: 'g' },
      { item: 'Heavy whipping cream (whipped to stiff peaks)', amount: 150, unit: 'ml', metricAmount: 150, metricUnit: 'ml' },
      { item: 'Powdered sugar for caramelization', amount: 50, unit: 'g', metricAmount: 50, metricUnit: 'g' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Classic 6-Turn Puff Pastry',
        instruction: 'Mix flour, salt, cold water, and 30g melted butter into a détrempe dough. Rest 30 mins chilled. Enclose pliable butter block inside détrempe. Roll and fold with 6 single turns (or 2 double + 2 single turns), chilling 30 minutes between turns.',
        chefTip: 'Ensure dough and butter block are at the exact same pliable 14°C temperature to prevent butter from fracturing.'
      },
      {
        stepNumber: 2,
        title: 'Caramelized Weighted Bake',
        instruction: 'Roll pastry to 2mm thin. Prick all over with a docking roller. Bake between two parchment sheets weighted down with a second baking tray at 190°C (375°F) for 25 mins. Remove top tray, dust with powdered sugar, and broil at 230°C for 3-4 minutes to caramelize to amber gold.',
        chefTip: 'The weighted bake keeps pastry layers uniformly flat and crunchy rather than domed and unruly.'
      },
      {
        stepNumber: 3,
        title: 'Fold Silky Diplomat Cream',
        instruction: 'Prepare a thick vanilla pastry cream scented with 2 Bourbon vanilla bean pods. Cool to room temperature, smooth with a whisk, then gently fold in 150ml of whipped heavy cream to lighten into airy diplomat cream.',
        chefTip: 'Gelatin is optional, but 2g sheet gelatin helps the cut slices stand tall and proud in the display case.'
      },
      {
        stepNumber: 4,
        title: 'Assembly & Precision Slicing',
        instruction: 'Trim caramelized pastry into three equal 10x24cm rectangles using a gentle sawing motion with a sharp serrated knife. Pipe uniform spheres of diplomat cream across first and second pastry layers. Stack, top with feathered icing or cocoa stripes, and chill 1 hour before serving.',
        chefTip: 'To cut without crushing the pastry, flip the assembled mille-feuille onto its side and slice vertically with a warm serrated blade!'
      }
    ],
    proTips: [
      'Caramelizing the top of the pastry leaves an impervious moisture barrier that keeps the mille-feuille crisp for up to 8 hours after filling.',
      'Always serve chilled with hot espresso or Darjeeling tea.'
    ]
  },
  {
    id: 'victorian-strawberry-gateau',
    title: 'Victorian Strawberry Shortcake Gâteau',
    frenchTitle: 'Gâteau Fraisier de la Reine aux Fraises des Bois',
    category: 'Cakes & Gateaux',
    emoji: '🍓',
    difficulty: 'Intermediate',
    prepTime: '45 mins',
    bakeTime: '25 mins',
    chillTime: '3 hours',
    servings: 10,
    description: 'An ethereal Japanese-French style chiffon sponge soaked in elderflower kirsch syrup, enveloped in pure Tahitian vanilla Chantilly cream and sweet glazed strawberries.',
    tags: ['Gâteau', 'Sponge Cake', 'Chantilly', 'Strawberries', 'Boudoir Classic'],
    associatedQuizId: 'quiz-cakes-frostings',
    caloriesPerServing: 290,
    equipment: ['8-inch round cake pan', 'Cake turntable & offset spatula', 'Cake ring & acetate collar film', 'Pastry brush'],
    ingredients: [
      { item: 'Cake flour (sifted three times)', amount: 120, unit: 'g', metricAmount: 120, metricUnit: 'g' },
      { item: 'Fine baker’s castor sugar', amount: 110, unit: 'g', metricAmount: 110, metricUnit: 'g' },
      { item: 'Large eggs (room temperature)', amount: 4, unit: 'large', metricAmount: 200, metricUnit: 'g' },
      { item: 'Whole milk', amount: 30, unit: 'ml', metricAmount: 30, metricUnit: 'ml' },
      { item: 'Unsalted butter (melted)', amount: 25, unit: 'g', metricAmount: 25, metricUnit: 'g' },
      { item: 'Heavy cream 36% fat (chilled)', amount: 500, unit: 'ml', metricAmount: 500, metricUnit: 'ml' },
      { item: 'Confectioners sugar (for Chantilly)', amount: 50, unit: 'g', metricAmount: 50, metricUnit: 'g' },
      { item: 'Pure vanilla extract', amount: 2, unit: 'tsp', metricAmount: 10, metricUnit: 'ml' },
      { item: 'Fresh ripe strawberries (hulled & halved)', amount: 450, unit: 'g', metricAmount: 450, metricUnit: 'g' },
      { item: 'Elderflower or simple syrup', amount: 60, unit: 'ml', metricAmount: 60, metricUnit: 'ml' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Genoise Sponge Aeration',
        instruction: 'Whisk eggs and sugar over a hot water bath (bain-marie) until warm to the touch (40°C/104°F). Transfer to stand mixer and whip on high speed for 7-8 minutes until voluminous, pale, and holds a ribbon for 4 seconds.',
        chefTip: 'Gentle warming before whipping relaxes egg proteins, allowing maximum volume and tiny, stable micro-bubbles.'
      },
      {
        stepNumber: 2,
        title: 'Fold Flour & Temper Butter',
        instruction: 'Sift cake flour over the whipped batter in two additions. Fold with a wide rubber spatula using sweeping J-motions. Combine melted butter and milk in a bowl, temper with a scoop of batter, then gently fold back into the main bowl.',
        chefTip: 'Temper the butter mixture so it disperses effortlessly without sinking to the pan bottom.'
      },
      {
        stepNumber: 3,
        title: 'Bake & Slice',
        instruction: 'Pour into lined 8-inch pan. Drop pan from 3 inches onto the counter once to dispel large air pockets. Bake at 170°C (340°F) for 23-25 mins until golden and springy. Cool upside down on a rack. Slice horizontally into three even 1.5cm tiers.',
        chefTip: 'Cooling upside down prevents the delicate sponge from contracting or dipping in the center.'
      },
      {
        stepNumber: 4,
        title: 'Layer with Chantilly & Strawberries',
        instruction: 'Whip chilled heavy cream with powdered sugar and vanilla to medium-stiff peaks. Soak sponge layers liberally with elderflower syrup. Arrange sliced strawberries along the acetate collar with cut sides facing outwards. Layer cream, strawberry chunks, and sponge tiers.',
        chefTip: 'Chill for at least 3 hours before removing the acetate collar for immaculate, razor-sharp patisserie edges.'
      }
    ],
    proTips: [
      'Always keep the bowl and beaters ice-cold when whipping Chantilly cream to prevent curdling into butter.',
      'Garnish the top with whole strawberries, mint leaves, and white chocolate curls for a luxurious boudoir presentation.'
    ]
  },
  {
    id: 'dark-chocolate-fondant-lava',
    title: 'Molten Valrhona Chocolate Lava Fondant',
    frenchTitle: 'Fondant Coulant au Chocolat Noir 70%',
    category: 'Cakes & Gateaux',
    emoji: '🍫',
    difficulty: 'Beginner',
    prepTime: '20 mins',
    bakeTime: '11 mins',
    servings: 4,
    description: 'Decadent individual cakes with a delicate cake crust that bursts open to release a cascading, molten river of warm 70% dark French chocolate and fleur de sel.',
    tags: ['Chocolate', 'Valrhona', 'Molten Lava', 'Quick Dessert', 'Decadent'],
    associatedQuizId: 'quiz-cakes-frostings',
    caloriesPerServing: 380,
    equipment: ['4 ceramic ramekins (6 oz)', 'Pastry brush & cocoa powder for dusting', 'Heat-proof glass bowl', 'Whisk'],
    ingredients: [
      { item: 'Valrhona Guanaja 70% dark chocolate (chopped)', amount: 150, unit: 'g', metricAmount: 150, metricUnit: 'g' },
      { item: 'European unsalted butter', amount: 120, unit: 'g', metricAmount: 120, metricUnit: 'g' },
      { item: 'Large whole eggs', amount: 2, unit: 'large', metricAmount: 100, metricUnit: 'g' },
      { item: 'Large egg yolks', amount: 2, unit: 'yolks', metricAmount: 35, metricUnit: 'g' },
      { item: 'Granulated sugar', amount: 70, unit: 'g', metricAmount: 70, metricUnit: 'g' },
      { item: 'All-purpose flour (sifted)', amount: 40, unit: 'g', metricAmount: 40, metricUnit: 'g' },
      { item: 'Dutch-process cocoa powder (for dusting ramekins)', amount: 15, unit: 'g', metricAmount: 15, metricUnit: 'g' },
      { item: 'Fleur de sel (sea salt flakes)', amount: 1, unit: 'pinch', metricAmount: 1, metricUnit: 'pinch' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Butter & Cocoa Ramekins',
        instruction: 'Generously butter 4 ramekins with softened butter using upward vertical brush strokes. Coat interior with sifted Dutch cocoa powder, tapping out any excess. Chill in fridge while making batter.',
        chefTip: 'Upward vertical brush strokes guide the fondant batter to rise evenly without catching on the rim.'
      },
      {
        stepNumber: 2,
        title: 'Melt Emulsion',
        instruction: 'Gently melt chopped chocolate and butter in a heatproof bowl set over a pot of barely simmering water (bain-marie). Stir until silky and glossy, then remove from heat to cool slightly (to approx 45°C).',
        chefTip: 'Never let steam or water drops enter melted chocolate or it will seize into a grainy clump.'
      },
      {
        stepNumber: 3,
        title: 'Whisk Eggs & Fold Flour',
        instruction: 'In another bowl, whisk eggs, extra yolks, sugar, and fleur de sel until pale and slightly frothy (do not over-aerate). Slowly whisk in the warm melted chocolate, then gently fold in sifted flour until just blended.',
        chefTip: 'Minimal flour ensures the center remains purely molten and velvety rather than bready.'
      },
      {
        stepNumber: 4,
        title: 'High-Heat Bake & Inversion',
        instruction: 'Divide into chilled ramekins. Bake at 205°C (400°F) for exactly 10 to 12 minutes. The edges will be firm and puffed while the center still jiggles gently. Rest for 1 minute, run a thin palette knife around edges, invert onto dessert plates, and dust with powdered sugar.',
        chefTip: 'Timing is everything! A 60-second variance changes a molten lava core into a regular cake.'
      }
    ],
    proTips: [
      'Prepare ramekins ahead of time and refrigerate up to 24 hours before baking—just add 1 extra minute to bake time!',
      'Serve alongside a scoop of Madagascar vanilla bean gelato or fresh raspberry coulis.'
    ]
  },
  {
    id: 'lemon-lavender-meringue-tart',
    title: 'Meyer Lemon Lavender Meringue Tart',
    frenchTitle: 'Tarte au Citron Meringuée & Fleurs de Lavande',
    category: 'Tartes & Viennoiserie',
    emoji: '🍋',
    difficulty: 'Intermediate',
    prepTime: '50 mins',
    bakeTime: '20 mins',
    chillTime: '2 hours',
    servings: 8,
    description: 'A crisp sweet French pâte sablée crust filled with silky, tart Meyer lemon curd infused with provence lavender, crowned with toasted Swiss meringue peaks.',
    tags: ['Lemon Tart', 'Meringue', 'Pâte Sablée', 'Citrus', 'French Classic'],
    associatedQuizId: 'quiz-pastry-fundamentals',
    caloriesPerServing: 310,
    equipment: ['9-inch fluted tart pan with removable bottom', 'Kitchen blowtorch', 'Fine mesh strainer', 'Pie weights or dried beans'],
    ingredients: [
      { item: 'All-purpose flour', amount: 200, unit: 'g', metricAmount: 200, metricUnit: 'g' },
      { item: 'Unsalted cold butter (diced)', amount: 100, unit: 'g', metricAmount: 100, metricUnit: 'g' },
      { item: 'Confectioners sugar', amount: 75, unit: 'g', metricAmount: 75, metricUnit: 'g' },
      { item: 'Egg yolk (for crust)', amount: 1, unit: 'yolk', metricAmount: 18, metricUnit: 'g' },
      { item: 'Cold heavy cream', amount: 15, unit: 'ml', metricAmount: 15, metricUnit: 'ml' },
      { item: 'Meyer lemon juice (freshly squeezed)', amount: 150, unit: 'ml', metricAmount: 150, metricUnit: 'ml' },
      { item: 'Meyer lemon zest (finely grated)', amount: 2, unit: 'tbsp', metricAmount: 10, metricUnit: 'g' },
      { item: 'Culinary lavender buds (steeped & strained)', amount: 1, unit: 'tsp', metricAmount: 2, metricUnit: 'g' },
      { item: 'Granulated sugar (for curd)', amount: 130, unit: 'g', metricAmount: 130, metricUnit: 'g' },
      { item: 'Whole eggs (for curd)', amount: 3, unit: 'large', metricAmount: 150, metricUnit: 'g' },
      { item: 'Cold butter (cubed, for curd emulsifying)', amount: 100, unit: 'g', metricAmount: 100, metricUnit: 'g' },
      { item: 'Egg whites (for Swiss meringue)', amount: 3, unit: 'whites', metricAmount: 90, metricUnit: 'g' },
      { item: 'Granulated sugar (for meringue)', amount: 150, unit: 'g', metricAmount: 150, metricUnit: 'g' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Blind-Bake Crisp Pâte Sablée',
        instruction: 'Pulse flour, powdered sugar, and cold butter until fine sand texture. Add yolk and cream; press into a flat disc and chill 1 hour. Roll to 3mm, fit into tart pan, freeze for 15 mins. Line with parchment and pie weights. Bake at 180°C (350°F) for 15 mins, remove weights and bake 5 more minutes until golden.',
        chefTip: 'Freezing the shaped tart shell before baking prevents the fluted sides from slumping down.'
      },
      {
        stepNumber: 2,
        title: 'Cook Meyer Lemon Lavender Curd',
        instruction: 'Whisk eggs, sugar, lemon zest, and lavender-infused lemon juice in a bowl over a double boiler. Whisk continuously until thickened to a custard consistency that coats the back of a spoon (82°C/180°F). Pass through fine sieve.',
        chefTip: 'Strain immediately to remove cooked egg proteins and lavender buds for ultra-velvety texture.'
      },
      {
        stepNumber: 3,
        title: 'Emulsify with Cold Butter',
        instruction: 'Let curd cool to 55°C (130°F). Using an immersion blender or vigorous whisk, incorporate cold cubed butter piece by piece until glossy and lightened in color. Pour into cooled tart shell and chill 2 hours to set firm.',
        chefTip: 'Emulsifying butter below 60°C creates a smooth fat crystal structure that stays firm yet creamy.'
      },
      {
        stepNumber: 4,
        title: 'Whip Swiss Meringue & Torch',
        instruction: 'Whisk egg whites and sugar over a hot water bath until sugar crystals dissolve completely and mixture hits 65°C (150°F). Whip on high speed until stiff, glossy, room-temperature peaks form. Pipe ornate rosettes across the tart and toast with a culinary torch.',
        chefTip: 'Heating egg whites to 65°C pasteurizes the whites and creates a stable, weeping-resistant meringue.'
      }
    ],
    proTips: [
      'Meyer lemons are naturally sweeter and floral compared to regular Eureka lemons, complementing lavender beautifully.',
      'Brush the baked tart shell with a thin layer of melted white chocolate before pouring curd to keep crust crisp for days!'
    ]
  },
  {
    id: 'bakery-pain-au-chocolat',
    title: 'Artisan Pain au Chocolat (Chocolate Croissant)',
    frenchTitle: 'Pain au Chocolat Feuilleté Traditionnel',
    category: 'Tartes & Viennoiserie',
    emoji: '🥐',
    difficulty: 'Master Baker',
    prepTime: '2 hours (plus overnight rest)',
    bakeTime: '18 mins',
    servings: 10,
    description: 'Golden, honeycomb-layered viennoiserie pastry with a paper-crisp shatter, wrapped around dual bars of rich 55% French baking chocolate.',
    tags: ['Croissant', 'Lamination', 'French Butter', 'Viennoiserie', 'Chocolat'],
    associatedQuizId: 'quiz-pastry-fundamentals',
    caloriesPerServing: 350,
    equipment: ['Long French rolling pin', 'Pizza wheel or pastry cutter', 'Pastry ruler', 'Pastry brush for egg wash'],
    ingredients: [
      { item: 'T55 or unbleached bread flour', amount: 500, unit: 'g', metricAmount: 500, metricUnit: 'g' },
      { item: 'Cold whole milk', amount: 140, unit: 'ml', metricAmount: 140, metricUnit: 'ml' },
      { item: 'Cold water', amount: 140, unit: 'ml', metricAmount: 140, metricUnit: 'ml' },
      { item: 'Instant dry yeast (gold osmotolerant)', amount: 10, unit: 'g', metricAmount: 10, metricUnit: 'g' },
      { item: 'Fine sea salt', amount: 10, unit: 'g', metricAmount: 10, metricUnit: 'g' },
      { item: 'Granulated sugar', amount: 60, unit: 'g', metricAmount: 60, metricUnit: 'g' },
      { item: 'European dry butter (84% butterfat beurrage)', amount: 280, unit: 'g', metricAmount: 280, metricUnit: 'g' },
      { item: 'Bakery chocolate batons (55% cocoa)', amount: 20, unit: 'batons', metricAmount: 150, metricUnit: 'g' },
      { item: 'Egg yolk + 1 tbsp cream (for egg wash)', amount: 1, unit: 'egg wash', metricAmount: 25, metricUnit: 'ml' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Knead Détrempe & Cold Proof',
        instruction: 'Combine flour, yeast, sugar, salt, milk, and water. Knead for 4 minutes on low speed until smooth with moderate gluten development. Shape into a flat rectangle, wrap tightly, and rest overnight in the refrigerator (12 hours).',
        chefTip: 'Slow cold overnight fermentation develops deep buttery, fermented aromas and relaxes dough elasticity for rolling.'
      },
      {
        stepNumber: 2,
        title: 'Beurrage & The Laminations',
        instruction: 'Pound cold dry butter between parchment into a 18x18cm square. Roll cold détrempe to 18x36cm. Place butter in center, fold dough flaps over, and seal edges. Perform one double fold (tour portefeuille / book fold) and one single fold (tour simple / letter fold), with 45 mins fridge chilling between folds.',
        chefTip: 'Keep butter between 12°C-15°C (54°F-59°F). If too cold it shatters; if too warm it melts into the dough.'
      },
      {
        stepNumber: 3,
        title: 'Shape with Dual Chocolate Batons',
        instruction: 'Roll laminated dough to 4mm thickness (25x50cm). Trim edges to expose layers. Cut into ten 8x12cm rectangles. Place first chocolate baton 1cm from edge, roll dough over once, place second baton, and finish rolling seam-side down.',
        chefTip: 'Use a razor-sharp wheel cutter straight down without dragging so you do not seal the delicate laminated edges.'
      },
      {
        stepNumber: 4,
        title: 'The Final Proof & High-Steam Bake',
        instruction: 'Proof at 26°C-27°C (80°F) with 75% humidity for 2 to 2.5 hours until jiggling like soufflés when shaken. Lightly egg wash only the curved top (avoid cut edges). Bake at 200°C (390°F) for 18 minutes until deep amber with visible honeycomb layers.',
        chefTip: 'Never proof above 28°C (82°F) or the butter inside the laminated layers will melt onto the baking sheet!'
      }
    ],
    proTips: [
      'High butterfat European style butter (82-84%) contains less water, ensuring crisp hollow layers rather than greasy dough.',
      'Eat fresh within 4 hours of baking for optimum flaky crackle!'
    ]
  },
  {
    id: 'vanilla-bean-creme-brulee',
    title: 'Tahitian Vanilla Bean Crème Brûlée',
    frenchTitle: 'Crème Brûlée Authentique à la Vanille de Tahiti',
    category: 'Custards & Spoon Desserts',
    emoji: '🍮',
    difficulty: 'Beginner',
    prepTime: '20 mins',
    bakeTime: '35 mins',
    chillTime: '4 hours',
    servings: 6,
    description: 'Velvety, rich baked egg yolk custard speckled with real Tahitian vanilla bean seeds, concealed beneath a paper-thin, crackling disc of caramelized golden sugar.',
    tags: ['Crème Brûlée', 'Custard', 'Vanilla Bean', 'Caramel', 'Gluten Free'],
    associatedQuizId: 'quiz-pastry-fundamentals',
    caloriesPerServing: 340,
    equipment: ['6 shallow wide ceramic ramekins', 'Large roasting pan (for water bath)', 'Fine mesh sieve', 'Culinary kitchen blowtorch'],
    ingredients: [
      { item: 'Heavy whipping cream (36% butterfat)', amount: 500, unit: 'ml', metricAmount: 500, metricUnit: 'ml' },
      { item: 'Whole milk', amount: 100, unit: 'ml', metricAmount: 100, metricUnit: 'ml' },
      { item: 'Tahitian vanilla bean pod', amount: 1, unit: 'pod', metricAmount: 1, metricUnit: 'pod' },
      { item: 'Large egg yolks', amount: 6, unit: 'yolks', metricAmount: 110, metricUnit: 'g' },
      { item: 'Fine granulated sugar (for custard)', amount: 80, unit: 'g', metricAmount: 80, metricUnit: 'g' },
      { item: 'Demerara or raw turbinado sugar (for torching)', amount: 40, unit: 'g', metricAmount: 40, metricUnit: 'g' },
      { item: 'Pinch of fine sea salt', amount: 1, unit: 'pinch', metricAmount: 1, metricUnit: 'pinch' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Infuse Warm Cream with Vanilla',
        instruction: 'Split vanilla bean lengthwise and scrape caviar seeds into saucepan with heavy cream and milk. Add pod hulls. Heat to a bare simmer over medium-low heat. Remove from heat, cover with a lid, and steep for 20 minutes.',
        chefTip: 'Steeping covered traps the volatile vanilla aroma compounds inside the dairy fat.'
      },
      {
        stepNumber: 2,
        title: 'Gentle Whisk & Sieve (Zero Bubbles)',
        instruction: 'Whisk yolks, sugar, and salt in a bowl gently until combined without whipping air into the mixture. Slowly temper in the warm infused cream. Strain through a fine-mesh sieve into a pouring pitcher, and skim off surface foam with a spoon.',
        chefTip: 'Foam on top of custard turns into spongey craters during baking. Skim every bubble off before pouring!'
      },
      {
        stepNumber: 3,
        title: 'Bain-Marie Low-Temperature Bake',
        instruction: 'Place ramekins in roasting pan. Pour custard into shallow dishes. Pour hot boiling water into the pan until halfway up ramekin sides. Bake at 150°C (300°F) for 30-35 mins until edges set and center wobbles like jelly.',
        chefTip: 'Shallow wide ramekins provide the superior custard-to-caramel crunch ratio!'
      },
      {
        stepNumber: 4,
        title: 'Chill & The Theatrical Sugar Crack',
        instruction: 'Cool ramekins to room temperature, then refrigerate uncovered for at least 4 hours. Right before serving, blot surface moisture with a paper towel. Sprinkle an even thin layer of demerara sugar and caramelize with a blowtorch into a mahogany glass sheet. Let cool 90 seconds to harden.',
        chefTip: 'Torching in two paper-thin layers produces a glass-like crust that shatters loudly under the spoon.'
      }
    ],
    proTips: [
      'Always serve immediately after torching so the cold custard contrasts beautifully with the warm, crackly caramel lid.',
      'Leftover egg whites are perfect for baking our Parisian Macarons or meringue kisses!'
    ]
  },
  {
    id: 'venetian-espresso-tiramisu',
    title: 'Traditional Venetian Espresso Tiramisu',
    frenchTitle: 'Tiramisù Artisanal au Mascarpone & Espresso',
    category: 'Custards & Spoon Desserts',
    emoji: '☕',
    difficulty: 'Intermediate',
    prepTime: '35 mins',
    bakeTime: '0 mins (No-Bake)',
    chillTime: '6 hours',
    servings: 9,
    description: 'Authentic Treviso-style Italian dessert layering light sponge savoiardi ladyfingers soaked in freshly brewed espresso and Marsala wine, enveloped in rich whipped zabaglione mascarpone cream.',
    tags: ['Tiramisu', 'Mascarpone', 'Espresso', 'Italian Classic', 'No-Bake'],
    associatedQuizId: 'quiz-cakes-frostings',
    caloriesPerServing: 360,
    equipment: ['8x8 inch glass baking dish', 'Stand mixer with whisk', 'Shallow dipping dish for coffee', 'Fine cocoa duster'],
    ingredients: [
      { item: 'Authentic Italian Savoiardi ladyfingers', amount: 24, unit: 'pieces', metricAmount: 200, metricUnit: 'g' },
      { item: 'Imported Italian Mascarpone cheese (chilled)', amount: 450, unit: 'g', metricAmount: 450, metricUnit: 'g' },
      { item: 'Large egg yolks (fresh)', amount: 4, unit: 'yolks', metricAmount: 70, metricUnit: 'g' },
      { item: 'Granulated sugar', amount: 90, unit: 'g', metricAmount: 90, metricUnit: 'g' },
      { item: 'Heavy whipping cream (whipped to soft peaks)', amount: 240, unit: 'ml', metricAmount: 240, metricUnit: 'ml' },
      { item: 'Freshly brewed strong espresso (cooled)', amount: 300, unit: 'ml', metricAmount: 300, metricUnit: 'ml' },
      { item: 'Sweet Marsala wine or Dark Rum', amount: 30, unit: 'ml', metricAmount: 30, metricUnit: 'ml' },
      { item: 'Valrhona Dutch-process unsweetened cocoa powder', amount: 25, unit: 'g', metricAmount: 25, metricUnit: 'g' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Whisk Zabaglione Base',
        instruction: 'Whisk egg yolks and sugar in a heatproof glass bowl over a pot of simmering water (double boiler) for 5-6 minutes until pale, thick, and temperature hits 70°C (158°F) for food safety. Remove and cool slightly.',
        chefTip: 'Cooking the yolks slightly creates velvety richness while pasteurizing the eggs.'
      },
      {
        stepNumber: 2,
        title: 'Fold Creamy Mascarpone',
        instruction: 'Beat chilled mascarpone cheese gently until smooth. Fold the cooled zabaglione into the mascarpone. Gently fold in the whipped heavy cream until an ethereal, pillowy golden cream forms.',
        chefTip: 'Never over-whip mascarpone or its high butterfat emulsion will break into grainy whey!'
      },
      {
        stepNumber: 3,
        title: 'The 1-Second Ladyfinger Dip',
        instruction: 'Mix cooled espresso and Marsala wine in a shallow bowl. Quick dip each savoiardi ladyfinger for exactly 1 second per side (do not soak!). Line the bottom of the dish in a tight single layer.',
        chefTip: 'Savoiardi are porous like sponges. A 1-second dip ensures they stay structured without turning into soggy mush.'
      },
      {
        stepNumber: 4,
        title: 'Layer & Chill 6+ Hours',
        instruction: 'Spread half the mascarpone cream over ladyfingers. Add a second layer of dipped cookies, then top with remaining cream. Smooth with an offset spatula. Cover and chill in refrigerator for at least 6 hours (preferably overnight). Dust generously with Dutch cocoa powder just before serving.',
        chefTip: 'Dusting with cocoa too early absorbs moisture from cream and turns dark and wet. Dust right before presentation!'
      }
    ],
    proTips: [
      'Tiramisù actually tastes even better on Day 2 as the espresso, Marsala, and mascarpone marry completely.',
      'For extra elegance, pipe individual dollops of mascarpone cream using a round nozzle across the top tier.'
    ]
  },
  {
    id: 'brown-butter-sea-salt-cookies',
    title: 'Brown Butter Fleur de Sel Chocolate Chunk Cookies',
    frenchTitle: 'Cookies Moelleux au Beurre Noisette & Chocolat Noir',
    category: 'Cookies & Confections',
    emoji: '🍪',
    difficulty: 'Beginner',
    prepTime: '25 mins (plus chill)',
    bakeTime: '11 mins',
    chillTime: '24 hours',
    servings: 14,
    description: 'Bakery-style thick cookies with caramelized nutty beurre noisette, pools of molten bittersweet chocolate disks, crispy caramelized edges, and flaky Maldon sea salt.',
    tags: ['Cookies', 'Brown Butter', 'Chocolate Chunk', 'Chewy', 'Bakery Style'],
    associatedQuizId: 'quiz-cookies-confections',
    caloriesPerServing: 280,
    equipment: ['Medium saucepan for browning butter', 'Large cookie scoop (No. 16 or 2 oz)', 'Baking sheets & parchment paper'],
    ingredients: [
      { item: 'European unsalted butter (for beurre noisette)', amount: 220, unit: 'g', metricAmount: 220, metricUnit: 'g' },
      { item: 'Dark brown sugar (firmly packed)', amount: 200, unit: 'g', metricAmount: 200, metricUnit: 'g' },
      { item: 'Granulated white sugar', amount: 70, unit: 'g', metricAmount: 70, metricUnit: 'g' },
      { item: 'Large egg (room temperature)', amount: 1, unit: 'large', metricAmount: 50, metricUnit: 'g' },
      { item: 'Large egg yolk', amount: 1, unit: 'yolk', metricAmount: 18, metricUnit: 'g' },
      { item: 'Pure Madagascar vanilla extract', amount: 2, unit: 'tsp', metricAmount: 10, metricUnit: 'ml' },
      { item: 'All-purpose unbleached flour', amount: 260, unit: 'g', metricAmount: 260, metricUnit: 'g' },
      { item: 'Baking soda (sodium bicarbonate)', amount: 1, unit: 'tsp', metricAmount: 5, metricUnit: 'g' },
      { item: 'Fine sea salt (in batter)', amount: 1, unit: 'tsp', metricAmount: 4, metricUnit: 'g' },
      { item: '70% Dark chocolate feves or rough hand-chopped bars', amount: 220, unit: 'g', metricAmount: 220, metricUnit: 'g' },
      { item: 'Maldon flaky sea salt (for finishing)', amount: 1, unit: 'tbsp', metricAmount: 5, metricUnit: 'g' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Mastering the Beurre Noisette',
        instruction: 'Melt butter in a light-colored saucepan over medium heat. Foam will rise, followed by crackling sounds as water evaporates. Swirl pan continuously until golden toasted milk solids collect at bottom and aroma smells deeply of toasted hazelnuts. Pour into bowl and cool 20 mins.',
        chefTip: 'Scrape every single dark brown speck from the pan bottom—that is where all the toffee flavor lives!'
      },
      {
        stepNumber: 2,
        title: 'Dissolve Sugars for Shiny Crinkle',
        instruction: 'Whisk brown sugar, white sugar, and cooled brown butter vigorously for 2 minutes. Add egg, yolk, and vanilla; whisk furiously until mixture lightens to a caramel ribbon texture and sugar partially dissolves.',
        chefTip: 'Vigorous whisking of eggs and sugar creates that coveted glossy, paper-thin crinkly cookie crust.'
      },
      {
        stepNumber: 3,
        title: 'Fold Flour & Hand-Cut Chocolate',
        instruction: 'Fold in sifted flour, baking soda, and salt with a spatula until nearly combined. Fold in chopped dark chocolate chunks (reserve a few chunks for top). Portion dough into 14 balls using a large scoop.',
        chefTip: 'Hand-chopped chocolate creates both tiny slivers that permeate the dough and large pools of molten chocolate.'
      },
      {
        stepNumber: 4,
        title: 'The 24-Hour Dough Ripening',
        instruction: 'Refrigerate portioned dough balls in a sealed container for 24 to 48 hours. Bake at 180°C (350°F) for 10-12 minutes until edges are crisp and golden brown while centers are still soft. Swirl a round cookie cutter around each cookie immediately upon exit to shape perfectly circular discs. Sprinkle generously with flaky Maldon salt.',
        chefTip: 'The 24-hour chill allows enzymes to break down starches into simple sugars, giving an unbelievable toffee depth!'
      }
    ],
    proTips: [
      'Never bake with warm dough—baking chilled dough keeps the cookies thick and chewy rather than thin and greasy.',
      'Press 2-3 chocolate chunks directly onto top of warm cookies right after baking for showstopping bakery aesthetics.'
    ]
  },
  {
    id: 'honey-lavender-glaced-madeleines',
    title: 'Honey-Glazed French Tea Madeleines',
    frenchTitle: 'Madeleines Pur Beurre au Miel de Fleur & Zeste de Citron',
    category: 'Cookies & Confections',
    emoji: '🍯',
    difficulty: 'Beginner',
    prepTime: '20 mins (plus 1 hour chill)',
    bakeTime: '10 mins',
    servings: 16,
    description: 'Traditional French teacakes with delicate scalloped backs and famous tall buttery "humps" (la bosse), infused with orange blossom honey and dipped in a translucent citrus glaze.',
    tags: ['Madeleine', 'French Teacake', 'Honey', 'Citrus', 'Afternoon Tea'],
    associatedQuizId: 'quiz-pastry-fundamentals',
    caloriesPerServing: 110,
    equipment: ['Traditional metal scalloped madeleine pan', 'Pastry brush for pan buttering', 'Piping bag or small scoop'],
    ingredients: [
      { item: 'Cake flour or pastry flour (sifted)', amount: 100, unit: 'g', metricAmount: 100, metricUnit: 'g' },
      { item: 'Baking powder', amount: 3, unit: 'g', metricAmount: 3, metricUnit: 'g' },
      { item: 'Granulated sugar', amount: 80, unit: 'g', metricAmount: 80, metricUnit: 'g' },
      { item: 'Wildflower or orange blossom honey', amount: 20, unit: 'g', metricAmount: 20, metricUnit: 'g' },
      { item: 'Large whole eggs', amount: 2, unit: 'large', metricAmount: 100, metricUnit: 'g' },
      { item: 'Unsalted European butter (melted & cooled)', amount: 100, unit: 'g', metricAmount: 100, metricUnit: 'g' },
      { item: 'Fresh lemon zest (finely microplaned)', amount: 1, unit: 'lemon', metricAmount: 5, metricUnit: 'g' },
      { item: 'Fine sea salt', amount: 1, unit: 'pinch', metricAmount: 1, metricUnit: 'pinch' },
      { item: 'Powdered sugar (for glaze)', amount: 60, unit: 'g', metricAmount: 60, metricUnit: 'g' },
      { item: 'Fresh lemon juice (for glaze)', amount: 15, unit: 'ml', metricAmount: 15, metricUnit: 'ml' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Rub Zest with Sugar & Whip Eggs',
        instruction: 'Rub lemon zest into granulated sugar with your fingertips until sugar is moist, fragrant, and yellow. Whisk eggs, honey, and zested sugar for 3 minutes until pale and frothy.',
        chefTip: 'Rubbing citrus zest into sugar friction-releases essential citrus oils that liquid whisking alone cannot unlock.'
      },
      {
        stepNumber: 2,
        title: 'Fold Flour & Melted Butter',
        instruction: 'Sift flour, baking powder, and salt together. Fold into egg mixture in two additions. Slowly drizzle in melted butter (at 35°C/95°F) while folding gently with a spatula until smooth and emulsified.',
        chefTip: 'Rest the batter covered in the refrigerator for at least 1 hour (or overnight)!'
      },
      {
        stepNumber: 3,
        title: 'The Thermal Shock for the Iconic Hump',
        instruction: 'Brush madeleine pan cavities generously with softened butter and dust with flour. Chill pan in freezer 15 mins. Pipe cold batter into each cavity filling 3/4 full. Bake in preheated 200°C (395°F) oven for 4 mins, then lower to 175°C (350°F) for 6 mins.',
        chefTip: 'The dramatic temperature contrast between ice-cold batter and blistering hot metal forces the center to erupt into the signature high hump (la bosse)!'
      },
      {
        stepNumber: 4,
        title: 'Dip Translucent Citrus Glaze',
        instruction: 'Whisk powdered sugar with fresh lemon juice. Turn madeleines out of the pan while warm onto a wire rack. Dip the scalloped ridges into the glaze and let set for 5 minutes until crisp and sparkling.',
        chefTip: 'Madeleines are best savored warm right out of the oven with Earl Grey or chamomile tea.'
      }
    ],
    proTips: [
      'Never skip the chill time: cold batter into a blazing oven is the absolute culinary secret to the madeleine hump.',
      'Traditional tin-plated steel pans conduct heat much better than silicone molds, yielding crisper golden ridges.'
    ]
  },
  {
    id: 'salted-caramel-tarte-tatin',
    title: 'Salted Caramel Apple Tarte Tatin',
    frenchTitle: 'Tarte Tatin Renversée aux Pommes Caramélisées',
    category: 'Tartes & Viennoiserie',
    emoji: '🍎',
    difficulty: 'Intermediate',
    prepTime: '40 mins',
    bakeTime: '45 mins',
    chillTime: '20 mins',
    servings: 8,
    description: 'An iconic French upside-down caramelized apple tart featuring Honeycrisp apples slow-poached in golden butterscotch caramel, capped with flaky golden puff pastry and flipped hot.',
    tags: ['Tarte Tatin', 'Apples', 'Salted Caramel', 'Puff Pastry', 'French Classic'],
    associatedQuizId: 'quiz-pastry-fundamentals',
    caloriesPerServing: 330,
    equipment: ['9-inch ovenproof heavy cast iron skillet or copper tatin dish', 'Apple peeler & melon baller', 'Large serving platter with rim'],
    ingredients: [
      { item: 'Honeycrisp or Pink Lady apples (peeled, halved, cored)', amount: 7, unit: 'large', metricAmount: 1400, metricUnit: 'g' },
      { item: 'European unsalted butter (cut into pieces)', amount: 85, unit: 'g', metricAmount: 85, metricUnit: 'g' },
      { item: 'Granulated sugar', amount: 150, unit: 'g', metricAmount: 150, metricUnit: 'g' },
      { item: 'Fleur de sel', amount: 0.5, unit: 'tsp', metricAmount: 2, metricUnit: 'g' },
      { item: 'All-butter puff pastry sheet (chilled)', amount: 1, unit: 'sheet', metricAmount: 250, metricUnit: 'g' },
      { item: 'Pure vanilla bean paste', amount: 1, unit: 'tsp', metricAmount: 5, metricUnit: 'ml' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Dry Sugar Caramel in Cast Iron',
        instruction: 'Melt sugar with 2 tbsp water in 9-inch cast iron skillet over medium heat without stirring until it turns a deep amber caramel. Remove from heat and immediately whisk in butter, fleur de sel, and vanilla paste.',
        chefTip: 'Watch closely: caramel turns from perfect golden copper to burnt in less than 20 seconds.'
      },
      {
        stepNumber: 2,
        title: 'Pack Apples Vertically',
        instruction: 'Tightly arrange apple halves vertically on their sides in concentric circles over the caramel, packing them as tightly as possible because apples shrink dramatically as moisture escapes during cooking.',
        chefTip: 'Leaving peeled apples uncovered in the fridge overnight dries their exterior, allowing intense caramel absorption.'
      },
      {
        stepNumber: 3,
        title: 'Stovetop Simmer & Pastry Cap',
        instruction: 'Cook skillet on low stovetop heat for 15-20 mins until caramel bubbles up and apples turn translucent and tender. Remove from heat, let cool 10 mins. Roll puff pastry 1 inch larger than skillet, drape over apples, and tuck edges down into the pan sides.',
        chefTip: 'Tucking the pastry inside creates a crisp bowl that captures the caramelized juices when inverted.'
      },
      {
        stepNumber: 4,
        title: 'Bake & The Theatrical Flip',
        instruction: 'Cut 3 small slits in pastry to vent steam. Bake at 190°C (375°F) for 35 mins until pastry is puffed and deep golden brown. Rest 10 mins on counter. Place a rimmed serving plate over pan and flip swiftly and decisively with oven mitts!',
        chefTip: 'Never let the tart cool completely before inverting or the caramel will glue itself stubbornly to the skillet.'
      }
    ],
    proTips: [
      'Firm, tart-sweet apples like Honeycrisp, Braeburn, or Pink Lady hold their shape and will not turn into applesauce.',
      'Serve warm topped with a generous dollop of crème fraîche to balance the sweet buttery caramel.'
    ]
  },
  {
    id: 'white-chocolate-berry-panna-cotta',
    title: 'White Chocolate Panna Cotta with Ruby Berry Coulis',
    frenchTitle: 'Panna Cotta au Chocolat Blanc & Coulis de Framboises',
    category: 'Custards & Spoon Desserts',
    emoji: '🍓',
    difficulty: 'Beginner',
    prepTime: '20 mins',
    bakeTime: '0 mins (No-Bake)',
    chillTime: '4 hours',
    servings: 6,
    description: 'Silky, trembling Italian sweet cream infused with Valrhona white chocolate and Tahitian vanilla, layered with a sparkling, tangy ruby raspberry coulis.',
    tags: ['Panna Cotta', 'White Chocolate', 'Raspberry Coulis', 'No-Bake', 'Gluten Free'],
    associatedQuizId: 'quiz-pastry-fundamentals',
    caloriesPerServing: 270,
    equipment: ['6 glass dessert coupes or ramekins', 'Fine-mesh strainer', 'Small saucepan'],
    ingredients: [
      { item: 'Heavy cream (36% fat)', amount: 400, unit: 'ml', metricAmount: 400, metricUnit: 'ml' },
      { item: 'Whole milk', amount: 100, unit: 'ml', metricAmount: 100, metricUnit: 'ml' },
      { item: 'Fine granulated sugar', amount: 30, unit: 'g', metricAmount: 30, metricUnit: 'g' },
      { item: 'High quality white chocolate (chopped fine)', amount: 100, unit: 'g', metricAmount: 100, metricUnit: 'g' },
      { item: 'Gold gelatin sheets (or 2 tsp gelatin powder)', amount: 2, unit: 'sheets', metricAmount: 4, metricUnit: 'g' },
      { item: 'Pure vanilla bean paste', amount: 1, unit: 'tsp', metricAmount: 5, metricUnit: 'ml' },
      { item: 'Fresh raspberries', amount: 200, unit: 'g', metricAmount: 200, metricUnit: 'g' },
      { item: 'Confectioners sugar (for coulis)', amount: 35, unit: 'g', metricAmount: 35, metricUnit: 'g' },
      { item: 'Fresh lemon juice', amount: 1, unit: 'tsp', metricAmount: 5, metricUnit: 'ml' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Bloom Gelatin',
        instruction: 'Submerge gelatin sheets in a bowl of ice-cold water for 5 minutes until soft and pliable. Squeeze out excess water gently.',
        chefTip: 'Always bloom gelatin in ice water—warm water melts gelatin prematurely before incorporation!'
      },
      {
        stepNumber: 2,
        title: 'Infuse Sweet Cream & Melt Chocolate',
        instruction: 'Heat cream, milk, sugar, and vanilla in saucepan to 80°C (175°F) just before boiling. Remove from heat, whisk in bloomed gelatin until dissolved, then pour over chopped white chocolate. Let sit 1 minute, then whisk until smooth.',
        chefTip: 'High-quality white chocolate with real cocoa butter provides rich structure with less gelatin required.'
      },
      {
        stepNumber: 3,
        title: 'Pour & Set Custard Glasses',
        instruction: 'Strain cream through a fine sieve into glass coupes. Cool to room temperature, then refrigerate for at least 4 hours until gently set with a delightful wiggle.',
        chefTip: 'Strain into a pitcher with a spout to pour cleanly without splashing the glass rims.'
      },
      {
        stepNumber: 4,
        title: 'Fresh Raspberry Coulis Garnish',
        instruction: 'Blend raspberries, powdered sugar, and lemon juice in a blender. Pass through fine sieve to remove seeds. Spoon glossy coulis over chilled panna cotta and garnish with fresh mint leaves.',
        chefTip: 'The tart acidity of the fresh coulis cuts through the luscious white chocolate cream beautifully.'
      }
    ],
    proTips: [
      'A great panna cotta should have the famous "tremble" (wobble on the spoon) rather than a rubbery texture.',
      'Can be made up to 3 days in advance and kept chilled.'
    ]
  }
];
