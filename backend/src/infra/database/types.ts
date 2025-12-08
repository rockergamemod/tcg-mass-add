/* ============================
 * Enums
 * ============================
 */

export enum GameKey {
  Pokemon = 'pokemon',
  // Add others as needed, e.g.:
  // Magic = 'mtg',
  // Yugioh = 'yugioh',
}

export enum CardSourceType {
  Tcgplayer = 'tcgplayer',
  Tcgdex = 'tcgdex',
  PokemonTcgData = 'pokemon_tcg_data',
  // Add others as needed:
  // Scryfall = 'scryfall',
}

export enum CardFinishType {
  Normal = 'normal',
  Holo = 'holofoil',
  ReverseHolo = 'reverse-holo',
  Unlimited = 'unlimited',
  UnlimitedHolo = 'unlimited-holo',
  FirstEdition = '1st-edition',
  FirstEditionHolo = '1st-edition-holo',
  // Extend as needed
}

export enum CardArtVariant {
  Normal = 'normal',
  IllustrationRare = 'illustration_rare',
  AltArt = 'alt_art',
  // Extend as needed
}

export enum TcgSetType {
  Main = 'main', // main expansions
  Mini = 'mini', // special/holiday sets
  Promo = 'promo', // SWSH promos, SV promos, etc.
  Deck = 'deck', // precon decks
  Box = 'box', // box-exclusive sets
  Virtual = 'virtual', // weird TCGplayer-only buckets like "Deck Exclusives"
  Other = 'other', // catch-all
}
