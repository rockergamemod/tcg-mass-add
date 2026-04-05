import { EntityManager } from '@mikro-orm/postgresql';
import { 
  TcgCard, 
  TcgCardSource, 
  TcgCardPrinting, 
  TcgSet, 
  TcgGame, 
  CardSourceType, 
  CardArtVariant, 
  CardFinishType,
  GameKey
} from '@repo/shared-types';
import { 
  extractArtVariantFromRow, 
  removeLeadingZeroes,
  tcgplayerConditionToFinishMap,
  SET_CODE_MAP 
} from '../tcgplayer-importer';
import { TcgplayerCsvRow } from '../tcgplayer-csv-parser';

// Mocking the module that causes the error
jest.mock('src/mikro-orm.config', () => ({
  __esModule: true,
  default: {},
}), { virtual: true });

describe('tcgplayer-importer utils', () => {
  describe('removeLeadingZeroes', () => {
    it('should remove leading zeroes', () => {
      expect(removeLeadingZeroes('034')).toBe('34');
    });

    it('should handle strings with no zeroes', () => {
      expect(removeLeadingZeroes('123')).toBe('123');
    });

    it('should return "0" for all-zero strings', () => {
      expect(removeLeadingZeroes('000')).toBe('0');
    });

    it('should handle empty strings', () => {
      expect(removeLeadingZeroes('')).toBe('');
    });
  });

  describe('extractArtVariantFromRow', () => {
    const mockRow: TcgplayerCsvRow = {
      tcgplayerProductId: '1',
      productLine: 'Pokemon',
      setName: 'Set',
      productName: 'Card',
      title: 'Title',
      number: '1',
      rarity: 'Common',
      condition: 'Near Mint',
      tcgMarketPrice: '1.00'
    };

    it('should return Normal if cardFinish is undefined', () => {
      expect(extractArtVariantFromRow(mockRow, undefined)).toBe(CardArtVariant.Normal);
    });

    it('should return IllustrationRare for Illustration Rare rarity', () => {
      const row = { ...mockRow, rarity: 'Illustration Rare' };
      expect(extractArtVariantFromRow(row, CardFinishType.Holo)).toBe(CardArtVariant.IllustrationRare);
    });

    it('should return SpecialIllustrationRare for Special Illustration Rare rarity', () => {
      const row = { ...mockRow, rarity: 'Special Illustration Rare' };
      expect(extractArtVariantFromRow(row, CardFinishType.Holo)).toBe(CardArtVariant.SpecialIllustrationRare);
    });

    it('should return AltFullArt for "(Alternate Full Art)" suffix', () => {
      const row = { ...mockRow, productName: 'Card (Alternate Full Art)' };
      expect(extractArtVariantFromRow(row, CardFinishType.Holo)).toBe(CardArtVariant.AltFullArt);
    });

    it('should return AltArt for "(Full Art)" suffix', () => {
      const row = { ...mockRow, productName: 'Card (Full Art)' };
      expect(extractArtVariantFromRow(row, CardFinishType.Holo)).toBe(CardArtVariant.AltArt);
    });

    it('should return AltArtSecret for "(Alternate Art Secret)" suffix', () => {
      const row = { ...mockRow, productName: 'Card (Alternate Art Secret)' };
      expect(extractArtVariantFromRow(row, CardFinishType.Holo)).toBe(CardArtVariant.AltArtSecret);
    });

    it('should return Secret for "(Secret)" suffix', () => {
      const row = { ...mockRow, productName: 'Card (Secret)' };
      expect(extractArtVariantFromRow(row, CardFinishType.Holo)).toBe(CardArtVariant.Secret);
    });

    it('should return PokeBall for "(Poke Ball Pattern)" suffix', () => {
      const row = { ...mockRow, productName: 'Card (Poke Ball Pattern)' };
      expect(extractArtVariantFromRow(row, CardFinishType.Holo)).toBe(CardArtVariant.PokeBall);
    });

    it('should return MasterBall for "(Master Ball Pattern)" suffix', () => {
      const row = { ...mockRow, productName: 'Card (Master Ball Pattern)' };
      expect(extractArtVariantFromRow(row, CardFinishType.Holo)).toBe(CardArtVariant.MasterBall);
    });
  });
});
