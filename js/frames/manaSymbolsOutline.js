//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsOutline.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsOutline.js');
}
if (!mana.get('outlinew')) {
	loadManaSymbols([
		'outline/outlinew', 'outline/outlineu', 'outline/outlineb', 'outline/outliner', 'outline/outlineg',
		'outline/outlinewu', 'outline/outlineub', 'outline/outlinebr', 'outline/outlinerg', 'outline/outlinegw',
		'outline/outlinewb', 'outline/outlineur', 'outline/outlinebg', 'outline/outlinerw', 'outline/outlinegu',
        'outline/outlinecw', 'outline/outlinecu', 'outline/outlinecb', 'outline/outlinecr', 'outline/outlinecg',
		'outline/outlinec', 'outline/outlines', 'outline/outlinex', 'outline/outline0', 'outline/outline1',
		'outline/outline2', 'outline/outline3', 'outline/outline4', 'outline/outline5', 'outline/outline6',
		'outline/outline7', 'outline/outline8', 'outline/outline9', 'outline/outlinet'
	]);
}