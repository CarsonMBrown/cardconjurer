//checks to see if it needs to run
if (!card.manaSymbols.includes('/js/frames/manaSymbolsOutlinePlaytest.js')) {
	card.manaSymbols.push('/js/frames/manaSymbolsOutlinePlaytest.js');
}
if (!mana.get('outlinePlaytestw')) {
	loadManaSymbols([
		'outlinePlaytest/outlinePlaytestw', 'outlinePlaytest/outlinePlaytestu', 'outlinePlaytest/outlinePlaytestb', 'outlinePlaytest/outlinePlaytestr', 'outlinePlaytest/outlinePlaytestg',
		'outlinePlaytest/outlinePlaytestc', 'outlinePlaytest/outlinePlaytests', 'outlinePlaytest/outlinePlaytestx', 'outlinePlaytest/outlinePlaytest0', 'outlinePlaytest/outlinePlaytest1',
		'outlinePlaytest/outlinePlaytest2', 'outlinePlaytest/outlinePlaytest3', 'outlinePlaytest/outlinePlaytest4', 'outlinePlaytest/outlinePlaytest5', 'outlinePlaytest/outlinePlaytest6',
		'outlinePlaytest/outlinePlaytest7', 'outlinePlaytest/outlinePlaytest8', 'outlinePlaytest/outlinePlaytest9', 'outlinePlaytest/outlinePlaytestt'
	]);
}