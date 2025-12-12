"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcgSetType = exports.CardArtVariant = exports.CardFinishType = exports.CardSourceType = exports.GameKey = void 0;
var GameKey;
(function (GameKey) {
    GameKey["Pokemon"] = "pokemon";
})(GameKey || (exports.GameKey = GameKey = {}));
var CardSourceType;
(function (CardSourceType) {
    CardSourceType["Tcgplayer"] = "tcgplayer";
    CardSourceType["Tcgdex"] = "tcgdex";
    CardSourceType["PokemonTcgData"] = "pokemon_tcg_data";
})(CardSourceType || (exports.CardSourceType = CardSourceType = {}));
var CardFinishType;
(function (CardFinishType) {
    CardFinishType["Normal"] = "normal";
    CardFinishType["Holo"] = "holofoil";
    CardFinishType["ReverseHolo"] = "reverse-holo";
    CardFinishType["Unlimited"] = "unlimited";
    CardFinishType["UnlimitedHolo"] = "unlimited-holo";
    CardFinishType["FirstEdition"] = "1st-edition";
    CardFinishType["FirstEditionHolo"] = "1st-edition-holo";
})(CardFinishType || (exports.CardFinishType = CardFinishType = {}));
var CardArtVariant;
(function (CardArtVariant) {
    CardArtVariant["Normal"] = "normal";
    CardArtVariant["IllustrationRare"] = "illustration-rare";
    CardArtVariant["SpecialIllustrationRare"] = "special-illustration-rare";
    CardArtVariant["AltArt"] = "alt-art";
    CardArtVariant["AltFullArt"] = "alt-full-art";
    CardArtVariant["AltArtSecret"] = "alt-art-secret";
    CardArtVariant["PokeBall"] = "poke-ball";
    CardArtVariant["MasterBall"] = "master-ball";
    CardArtVariant["Secret"] = "secret";
})(CardArtVariant || (exports.CardArtVariant = CardArtVariant = {}));
var TcgSetType;
(function (TcgSetType) {
    TcgSetType["Main"] = "main";
    TcgSetType["Mini"] = "mini";
    TcgSetType["Promo"] = "promo";
    TcgSetType["Deck"] = "deck";
    TcgSetType["Box"] = "box";
    TcgSetType["Virtual"] = "virtual";
    TcgSetType["Other"] = "other";
})(TcgSetType || (exports.TcgSetType = TcgSetType = {}));
//# sourceMappingURL=types.js.map