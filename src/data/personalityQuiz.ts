export interface PersonalityChoice {
  text: string;
  emoji: string;
  archetypeId: string; // matches PastryArchetype.id
  flavorNote: string;
}

export interface PersonalityQuestion {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  choices: PersonalityChoice[];
}

export interface PastryArchetype {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  badge: string;
  traits: string[];
  description: string;
  sweetPairing: string;
  bakingMotto: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
}

export const PASTRY_ARCHETYPES: Record<string, PastryArchetype> = {
  croissant: {
    id: 'croissant',
    name: 'The Golden French Croissant',
    emoji: '🥐',
    tagline: 'Sophisticated, layered, patient, and effortlessly chic.',
    badge: '100% French Butter & Elegance',
    traits: ['Layered & Thoughtful', 'Patient Perfectionist', 'Classic Taste', 'Grace Under Pressure'],
    description:
      'You are composed, refined, and deeply intentional. Just like the 27 delicate laminated butter layers of a Viennoiserie masterpiece, you take time to develop your craft and never rush true excellence. People admire your quiet confidence, timeless aesthetic, and the way you bring effortless elegance into everyday moments.',
    sweetPairing: 'Best paired with a rich Café au Lait and a Wild Artisan Sourdough friend who appreciates slow mornings.',
    bakingMotto: '“Patience is the secret ingredient that turns simple butter and flour into pure golden magic.”',
    colorScheme: {
      bg: 'bg-amber-50',
      border: 'border-amber-400',
      text: 'text-amber-950',
      accent: 'bg-amber-500',
    },
  },
  macaron: {
    id: 'macaron',
    name: 'The Parisian Raspberry Macaron',
    emoji: '🍓',
    tagline: 'Delicate, detail-oriented, artistic, and aesthetic.',
    badge: 'Almond Flour & Silky Ganache',
    traits: ['Aesthetic Visionary', 'Eye for Detail', 'Chic & Polished', 'Sweet Romantic'],
    description:
      'You have an incredible eye for harmony, color, and beauty. You notice the tiny brushstrokes of life that others breeze past. Beneath your polished and poised exterior lies a tender, sweet heart filled with genuine loyalty and warmth. You transform every space you enter into a cozy Parisian boudoir.',
    sweetPairing: 'Best paired with a pot of Earl Grey tea and a Funfetti Cupcake buddy to bring out your playful giggle.',
    bakingMotto: '“Life is too sweet to settle for anything less than exquisite detail and a pink ribbon bow.”',
    colorScheme: {
      bg: 'bg-rose-50',
      border: 'border-rose-400',
      text: 'text-rose-950',
      accent: 'bg-rose-500',
    },
  },
  cupcake: {
    id: 'cupcake',
    name: 'The Funfetti Celebration Cupcake',
    emoji: '🧁',
    tagline: 'Joyful, spontaneous, bubbly, and the heartbeat of every room.',
    badge: 'Rainbow Sprinkles & Buttercream',
    traits: ['Bubbly Energy', 'Spontaneous Spirit', 'Brings the Joy', 'Generous Heart'],
    description:
      'You are sunshine in human form! Wherever you go, you bring laughter, rainbow sprinkles, and contagious positivity. You don’t wait for a special occasion to celebrate—you believe being alive together today is reason enough for frosting. Friends lean on you when they need a smile and a burst of hope.',
    sweetPairing: 'Best paired with a Warm Chocolate Chip Cookie friend for wholesome adventures and late-night laughing fits.',
    bakingMotto: '“When the world feels serious, pile on an extra swirl of frosting and toss some sprinkles!”',
    colorScheme: {
      bg: 'bg-pink-50',
      border: 'border-pink-400',
      text: 'text-pink-950',
      accent: 'bg-pink-500',
    },
  },
  cookie: {
    id: 'cookie',
    name: 'The Warm Chocolate Chip Cookie',
    emoji: '🍪',
    tagline: 'Heartwarming, loyal, comforting, and unconditionally sweet.',
    badge: 'Gooey Center & Sea Salt Flakes',
    traits: ['Warm & Comforting', 'Loyal Confidante', 'Wholesome Soul', 'Cozy Presence'],
    description:
      'You are the ultimate comfort in a busy world. Honest, reliable, and deeply caring, you make everyone feel right at home. You are the first person friends call when they need genuine reassurance without judgment. You have a timeless warmth that never goes out of style.',
    sweetPairing: 'Best paired with a tall glass of cold oat milk and a Molten Lava Cake friend for deep, heartfelt conversations.',
    bakingMotto: '“A warm heart and a gooey center will heal almost any troubled afternoon.”',
    colorScheme: {
      bg: 'bg-orange-50',
      border: 'border-orange-400',
      text: 'text-orange-950',
      accent: 'bg-orange-500',
    },
  },
  redvelvet: {
    id: 'redvelvet',
    name: 'The Dramatic Red Velvet Cake',
    emoji: '🍰',
    tagline: 'Romantic, passionate, velvety smooth, and unforgettable.',
    badge: 'Velvety Crumb & Tangy Cream Cheese',
    traits: ['Passionate & Expressive', 'Dramatic Flair', 'Warm Charisma', 'Unapologetically Bold'],
    description:
      'You live life in rich, vibrant hues. Unafraid to express your emotions and share your passions, you draw people in with your undeniable charisma and theatrical charm. Beneath the dramatic ruby exterior is a deeply nurturing, generous companion who loves creating memorable moments.',
    sweetPairing: 'Best paired with a Golden French Croissant friend who appreciates your dramatic stories and flair.',
    bakingMotto: '“Never dim your color to fit in when you were born to stand tall on a porcelain cake stand.”',
    colorScheme: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-950',
      accent: 'bg-red-600',
    },
  },
  sourdough: {
    id: 'sourdough',
    name: 'The Wild Artisan Sourdough',
    emoji: '🥖',
    tagline: 'Independent, authentic, grounded, and resilient to the core.',
    badge: 'Wild Ferment & Blistered Crust',
    traits: ['Authentic & Real', 'Grounded Nature', 'Slow Living', 'Resilient Soul'],
    description:
      'You don’t chase fleeting fads; you cherish substance, craft, and authenticity. You thrive when given space to grow at your own natural pace. You appreciate crisp morning air, honest conversations, and good craftsmanship. Underneath your sturdy, protective crust is a soft, soulful interior.',
    sweetPairing: 'Best paired with a Salty Sweet Pretzel buddy who shares your love of honest humor and rustic adventures.',
    bakingMotto: '“Good things take fermentation, good crust, and staying true to your roots.”',
    colorScheme: {
      bg: 'bg-stone-50',
      border: 'border-stone-400',
      text: 'text-stone-950',
      accent: 'bg-stone-600',
    },
  },
  pretzel: {
    id: 'pretzel',
    name: 'The Golden Salted Soft Pretzel',
    emoji: '🥨',
    tagline: 'Witty, adaptable, balanced, and loves twisting life into fun.',
    badge: 'Bavarian Twist & Coarse Salt',
    traits: ['Quick-Witted Humor', 'Twisty & Adaptable', 'Sweet & Salty Balance', 'Down-to-Earth'],
    description:
      'You are delightfully grounded with a clever, playful twist. You don’t take things too seriously and have a knack for finding the funny side of stressful situations. You balance sweet empathy with a sharp, salty wit that keeps everyone laughing and grounded.',
    sweetPairing: 'Best paired with spicy mustard dip and a Parisian Macaron friend who secretly loves your goofy jokes.',
    bakingMotto: '“Life throws curves and twists—might as well bake them into something golden and delicious!”',
    colorScheme: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-950',
      accent: 'bg-yellow-600',
    },
  },
  lavacake: {
    id: 'lavacake',
    name: 'The Molten Dark Chocolate Lava Cake',
    emoji: '🍫',
    tagline: 'Deep, mysterious, intensely loyal, with an overflowing heart.',
    badge: '70% Valrhona Ganache Core',
    traits: ['Deep Thinker', 'Intensely Loyal', 'Warm Hearted', 'Passionate Soul'],
    description:
      'On the outside, you may seem calm, composed, and selective about who you open up to. But once someone earns your trust, your heart overflows with fierce loyalty, warmth, and profound empathy. You feel deeply and bring immense richness into the lives of your chosen few.',
    sweetPairing: 'Best paired with vanilla bean gelato and a Warm Chocolate Chip Cookie friend for late-night stargazing.',
    bakingMotto: '“The richest treasures are hidden deep inside, waiting for the right spoon to reveal them.”',
    colorScheme: {
      bg: 'bg-neutral-100',
      border: 'border-neutral-700',
      text: 'text-neutral-900',
      accent: 'bg-neutral-900',
    },
  },
};

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    id: 'q1',
    title: 'How do you greet a cozy Sunday morning?',
    subtitle: 'Picture your dream start to an open, unhurried day...',
    icon: '☕',
    choices: [
      {
        text: 'Reading by an open window with café au lait and quiet French piano tunes',
        emoji: '🥐',
        archetypeId: 'croissant',
        flavorNote: 'Laminated serenity & quiet chic',
      },
      {
        text: 'Dancing in pajamas, whipping up rainbow pancakes with loud happy tunes',
        emoji: '🧁',
        archetypeId: 'cupcake',
        flavorNote: 'Joyful celebration & morning music',
      },
      {
        text: 'Tending to houseplants, brewing dark pour-over, and a crisp walk in nature',
        emoji: '🥖',
        archetypeId: 'sourdough',
        flavorNote: 'Grounded roots & fresh crisp air',
      },
      {
        text: 'Curling under three plush velvet duvets with an emotional novel and cocoa',
        emoji: '🍫',
        archetypeId: 'lavacake',
        flavorNote: 'Deep cocooning & rich comfort',
      },
    ],
  },
  {
    id: 'q2',
    title: 'Your best friend calls you in an unexpected crisis. What is your instinct?',
    subtitle: 'No wrong answers — how does your heart respond first?',
    icon: '💌',
    choices: [
      {
        text: 'Show up at their front door with freshly baked warm cookies and an unconditional hug',
        emoji: '🍪',
        archetypeId: 'cookie',
        flavorNote: 'Pure comforting sanctuary',
      },
      {
        text: 'Draft a calm, methodical step-by-step master plan with spreadsheet elegance',
        emoji: '🥐',
        archetypeId: 'croissant',
        flavorNote: 'Precision strategy & composed poise',
      },
      {
        text: 'Bring sparkling berry cider, cupcakes, and tell silly stories until they burst into laughter',
        emoji: '🧁',
        archetypeId: 'cupcake',
        flavorNote: 'Uplifting spirits & sparkling joy',
      },
      {
        text: 'Crack an affectionate witty joke, bring pretzels, and help them twist the mess into perspective',
        emoji: '🥨',
        archetypeId: 'pretzel',
        flavorNote: 'Grounded humor & practical balance',
      },
    ],
  },
  {
    id: 'q3',
    title: 'What is your signature aesthetic or dream bakery room vibe?',
    subtitle: 'Pick the ambiance where your spirit feels completely at home...',
    icon: '🎀',
    choices: [
      {
        text: 'Vintage Parisian boudoir with pink candy stripes, crystal chandeliers & silk bows',
        emoji: '🍓',
        archetypeId: 'macaron',
        flavorNote: 'Rococo romantic & pastel luxury',
      },
      {
        text: 'Rustic timber shelves with flour dust, iron Dutch ovens & hand-thrown ceramics',
        emoji: '🥖',
        archetypeId: 'sourdough',
        flavorNote: 'Artisan craft & warm natural wood',
      },
      {
        text: 'Velvet speakeasy parlor with candlelit marble counters and rich aroma of dark cocoa',
        emoji: '🍫',
        archetypeId: 'lavacake',
        flavorNote: 'Intimate mystery & molten warmth',
      },
      {
        text: 'Glamorous theatrical salon with crimson velvet drapery and grand cake stands',
        emoji: '🍰',
        archetypeId: 'redvelvet',
        flavorNote: 'Dramatic romance & opulent flair',
      },
    ],
  },
  {
    id: 'q4',
    title: 'Chaos strikes in the kitchen! The timer didn’t ring. What do you do?',
    subtitle: 'Every baker has their own superpower under heat...',
    icon: '👩‍🍳',
    choices: [
      {
        text: 'Take a deep breath, assess the crumb, and find a clever harmonious adjustment',
        emoji: '🥐',
        archetypeId: 'croissant',
        flavorNote: 'Grace under kitchen pressure',
      },
      {
        text: 'Laugh out loud, toss on extra rainbow frosting, and call it an avant-garde trend!',
        emoji: '🧁',
        archetypeId: 'cupcake',
        flavorNote: 'Spontaneous delightful improv',
      },
      {
        text: 'Trust the process — great baking comes with wild blisters and authentic character',
        emoji: '🥖',
        archetypeId: 'sourdough',
        flavorNote: 'Resilient and unbothered',
      },
      {
        text: 'Turn down the lights, dust it with powdered sugar, and serve it warm with passion',
        emoji: '🍰',
        archetypeId: 'redvelvet',
        flavorNote: 'Dramatic presentation turns any tide',
      },
    ],
  },
  {
    id: 'q5',
    title: 'Which sensory pastry moment makes your heart flutter most?',
    subtitle: 'Close your eyes and taste the magic...',
    icon: '✨',
    choices: [
      {
        text: 'The delicate crisp eggshell bite of a macaron yielding to silky raspberry cream',
        emoji: '🍓',
        archetypeId: 'macaron',
        flavorNote: 'Aesthetic perfection & delicate crunch',
      },
      {
        text: 'Pulling apart a warm cookie and seeing strings of melted gooey chocolate chips',
        emoji: '🍪',
        archetypeId: 'cookie',
        flavorNote: 'Nostalgic sweetness & melting heart',
      },
      {
        text: 'The deep musical shatter of a thousand buttery golden croissant flakes',
        emoji: '🥐',
        archetypeId: 'croissant',
        flavorNote: 'Crispy lamination perfection',
      },
      {
        text: 'Slicing open a warm dark cake to watch a river of molten ganache pour out',
        emoji: '🍫',
        archetypeId: 'lavacake',
        flavorNote: 'Decadent emotional payoff',
      },
    ],
  },
  {
    id: 'q6',
    title: 'What is your hidden superpower that people always cherish in you?',
    subtitle: 'The special quality you bring to everyone in your circle...',
    icon: '🌟',
    choices: [
      {
        text: 'Making any space instantly feel cozy, gentle, and emotionally safe',
        emoji: '🍪',
        archetypeId: 'cookie',
        flavorNote: 'Safe harbor & sincere kindness',
      },
      {
        text: 'Turning any mundane Tuesday into an unforgettable celebration with tiny touches',
        emoji: '🧁',
        archetypeId: 'cupcake',
        flavorNote: 'Sparkling infectious joy',
      },
      {
        text: 'Spotting delicate nuances, aesthetic harmonies, and beautiful details others miss',
        emoji: '🍓',
        archetypeId: 'macaron',
        flavorNote: 'Refined artistic discernment',
      },
      {
        text: 'Cutting through pretension with witty humor and keeping everyone grounded',
        emoji: '🥨',
        archetypeId: 'pretzel',
        flavorNote: 'Clever twist & real talk',
      },
    ],
  },
  {
    id: 'q7',
    title: 'Pick a secret baker’s charm to slip into your apron pocket:',
    subtitle: 'A sweet talisman for your daily baking adventures...',
    icon: '🔮',
    choices: [
      {
        text: 'A silky black grosgrain ribbon bow 🎀 for poise and timeless Parisian charm',
        emoji: '🎀',
        archetypeId: 'macaron',
        flavorNote: 'Haute couture patisserie energy',
      },
      {
        text: 'A jar of coarse sparkling Maldon sea salt 🧂 for bringing out the deepest flavors',
        emoji: '🥨',
        archetypeId: 'pretzel',
        flavorNote: 'Perfect sweet & savory balance',
      },
      {
        text: 'A vial of Madagascar Bourbon vanilla bean caviar ✨ for warmth that lingers',
        emoji: '🍰',
        archetypeId: 'redvelvet',
        flavorNote: 'Luxurious velvety charisma',
      },
      {
        text: 'A sourdough starter named “Bulle” that has been kept alive with love for 100 years',
        emoji: '🥖',
        archetypeId: 'sourdough',
        flavorNote: 'Generational patience & heritage',
      },
    ],
  },
];
