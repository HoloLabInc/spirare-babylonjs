type TilesetType =
  | 'テクスチャなし'
  | 'テクスチャ付き'
  | 'テクスチャ付き（低解像度）'
  | string

export class TilesetData {
  constructor(
    public readonly name: string,
    public readonly type: TilesetType,
    public readonly url: string
  ) {}

  public static async getRootContentUrlAsync(
    tilesetData: TilesetData
  ): Promise<string> {
    const response = await fetch(tilesetData.url)
    const tileset = (await response.json()) as Tileset
    return new URL(tileset.root.content.uri, tilesetData.url).href
  }

  public static async getAllContentUrlAsync(
    tilesetData: TilesetData
  ): Promise<string[]> {
    const response = await fetch(tilesetData.url)
    const tileset = (await response.json()) as Tileset
    const urlList = this.getAllTilesetUrl(tileset.root)
    return urlList.map((x) => new URL(x, tilesetData.url).href)
  }

  private static getAllTilesetUrl(tilesetElement: TilesetElement): string[] {
    const url = tilesetElement.content.uri
    const children = tilesetElement.children
    console.log(children)
    if (!children) {
      return [url]
    }
    const childUrlList = children?.flatMap((x) => this.getAllTilesetUrl(x))
    return [url, ...childUrlList]
  }
}

type TilesetContent = {
  uri: string
}

type TilesetElement = {
  content: TilesetContent
  children: Array<TilesetElement>
}

type Tileset = {
  root: TilesetElement
}

export class Streaming3dTiles {
  public static readonly tilesets: readonly TilesetData[] = [
    {
      name: '建物モデル（千代田区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13101_chiyoda-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（千代田区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13101_chiyoda-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（千代田区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13101_chiyoda-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（中央区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13102_chuo-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（中央区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13102_chuo-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（中央区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13102_chuo-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（港区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13103_minato-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（港区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13103_minato-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（港区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13103_minato-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（新宿区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13104_shinjuku-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（新宿区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13104_shinjuku-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（新宿区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13104_shinjuku-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（文京区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13105_bunkyo-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（台東区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13106_taito-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（墨田区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13107_sumida-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（江東区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13108_koto-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（江東区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13108_koto-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（江東区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13108_koto-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（品川区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13109_shinagawa-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（品川区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13109_shinagawa-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（品川区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13109_shinagawa-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（目黒区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13110_meguro-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（大田区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13111_ota-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（大田区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13111_ota-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（大田区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13111_ota-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（世田谷区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13112_setagaya-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（渋谷区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13113_shibuya-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（渋谷区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13113_shibuya-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（渋谷区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13113_shibuya-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（中野区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13114_nakano-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（杉並区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13115_suginami-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（豊島区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13116_toshima-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（豊島区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13116_toshima-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（豊島区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13116_toshima-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（北区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13117_kita-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（荒川区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13118_arakawa-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（板橋区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13119_itabashi-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（練馬区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13120_nerima-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（足立区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13121_adachi-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（葛飾区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13122_katsushika-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（江戸川区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13100_tokyo/13123_edogawa-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（八王子市南大沢）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13201_hachioji/notexture/tileset.json',
    },
    {
      name: '建物モデル（八王子市南大沢）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13201_hachioji/texture/tileset.json',
    },
    {
      name: '建物モデル（八王子市南大沢）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13201_hachioji/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（東村山市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13213_higashimurayama/notexture/tileset.json',
    },
    {
      name: '建物モデル（東村山市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13213_higashimurayama/texture/tileset.json',
    },
    {
      name: '建物モデル（東村山市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/13213_higashimurayama/low_resolution/tileset.json',
    },
    {
      name: '橋梁モデル（東京都23区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/brid/13100_tokyo/tileset.json',
    },
    {
      name: '橋梁モデル（八王子市南大沢）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/brid/13201_hachioji/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（東京23区）',
      type: '荒川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/notexture/arakawa_l1/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（東京23区）',
      type: '荒川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/notexture/arakawa_l2/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（東京23区）',
      type: '荒川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture/arakawa_l1/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（東京23区）',
      type: '荒川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture/arakawa_l2/tileset.json',
    },
    {
      name: '利根川水系江戸川洪水浸水想定区域（東京23区）',
      type: '江戸川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/notexture/edogawa_l1/tileset.json',
    },
    {
      name: '利根川水系江戸川洪水浸水想定区域（東京23区）',
      type: '江戸川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/notexture/edogawa_l2/tileset.json',
    },
    {
      name: '利根川水系江戸川洪水浸水想定区域（東京23区）',
      type: '江戸川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture/edogawa_l1/tileset.json',
    },
    {
      name: '利根川水系江戸川洪水浸水想定区域（東京23区）',
      type: '江戸川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture/edogawa_l2/tileset.json',
    },
    {
      name: '利根川水系利根川洪水浸水想定区域（東京23区）',
      type: '利根川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/notexture/tonegawa_l1/tileset.json',
    },
    {
      name: '利根川水系利根川洪水浸水想定区域（東京23区）',
      type: '利根川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/notexture/tonegawa_l2/tileset.json',
    },
    {
      name: '利根川水系利根川洪水浸水想定区域（東京23区）',
      type: '利根川L1（計画規模）(水面表現)',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture/tonegawa_l1/tileset.json',
    },
    {
      name: '利根川水系利根川洪水浸水想定区域（東京23区）',
      type: '利根川L2（想定最大規模）(水面表現)',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture/tonegawa_l2/tileset.json',
    },
    {
      name: '多摩水系多摩川、浅川、大栗川洪水浸水想定区域（東京23区）',
      type: '多摩川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/notexture/tamagawa_l1/tileset.json',
    },
    {
      name: '多摩水系多摩川、浅川、大栗川洪水浸水想定区域（東京23区）',
      type: '多摩川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/notexture/tamagawa_l2/tileset.json',
    },
    {
      name: '多摩水系多摩川、浅川、大栗川洪水浸水想定区域（東京23区）',
      type: '多摩川L1（計画規模）(水面表現)',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture/tamagawa_l1/tileset.json',
    },
    {
      name: '多摩水系多摩川、浅川、大栗川洪水浸水想定区域（東京23区）',
      type: '多摩川L2（想定最大規模）(水面表現)',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture/tamagawa_l2/tileset.json',
    },
    {
      name: '城南地区河川流域浸水予想区域（改定）（東京23区）',
      type: '城南地区L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/pref/jonan_chiku_l2/tileset.json',
    },
    {
      name: '城南地区河川流域浸水予想区域（改定）（東京23区）',
      type: '城南地区L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture_pref/jonan_chiku_l2/tileset.json',
    },
    {
      name: '江東内部河川流域浸水予想区域（東京23区）',
      type: '江東内部河川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/pref/koto_naibu_l2/tileset.json',
    },
    {
      name: '江東内部河川流域浸水予想区域（東京23区）',
      type: '江東内部河川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture_pref/koto_naibu_l2/tileset.json',
    },
    {
      name: '石神井川及び白子川流域浸水予想区域（東京23区）',
      type: '石神井川および白子川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/pref/shakujiigawa_etc_l2/tileset.json',
    },
    {
      name: '石神井川及び白子川流域浸水予想区域（東京23区）',
      type: '石神井川および白子川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture_pref/shakujiigawa_etc_l2/tileset.json',
    },
    {
      name: '神田川流域浸水予想区域（東京23区）',
      type: '神田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/pref/kandagawa_l2/tileset.json',
    },
    {
      name: '神田川流域浸水予想区域（東京23区）',
      type: '神田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture_pref/kandagawa_l2/tileset.json',
    },
    {
      name: '野川、仙川、入間川、谷沢川及び丸子川流域浸水予想区域（東京23区）',
      type: '野川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/pref/nogawa_l2/tileset.json',
    },
    {
      name: '野川、仙川、入間川、谷沢川及び丸子川流域浸水予想区域（東京23区）',
      type: '野川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture_pref/nogawa_l2/tileset.json',
    },
    {
      name: '黒目川、落合川、柳瀬川、空堀川及び奈良橋川流域浸水予想区域（東山村市）',
      type: '黒目川、落合川、柳瀬川、空堀川及び奈良橋川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/pref/higashimurayama_kuromegawa_etc_l2/tileset.json',
    },
    {
      name: '黒目川、落合川、柳瀬川、空堀川及び奈良橋川流域浸水予想区域（東山村市）',
      type: '黒目川、落合川、柳瀬川、空堀川及び奈良橋川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture_pref/higashimurayama_kuromegawa_etc_l2/tileset.json',
    },
    {
      name: '石神井川及び白子川浸水想定区域（東山村市）',
      type: '石神井川及び白子川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/pref/higashimurayama_shakujiigawa_etc_l2/tileset.json',
    },
    {
      name: '石神井川及び白子川浸水想定区域（東山村市）',
      type: '石神井川及び白子川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/13100_tokyo/texture_pref/higashimurayama_shakujiigawa_etc_l2/tileset.json',
    },
    {
      name: '建物モデル（札幌市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/01100_sapporo/notexture/tileset.json',
    },
    {
      name: '建物モデル（札幌市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/01100_sapporo/texture/tileset.json',
    },
    {
      name: '建物モデル（札幌市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/01100_sapporo/low_resolution/tileset.json',
    },
    {
      name: '石狩川水系石狩川下流洪水浸水想定区域（札幌市）',
      type: '石狩川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/notexture/ishikarigawa_l1/tileset.json',
    },
    {
      name: '石狩川水系石狩川下流洪水浸水想定区域（札幌市）',
      type: '石狩川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/notexture/ishikarigawa_l2/tileset.json',
    },
    {
      name: '石狩川水系石狩川下流洪水浸水想定区域（札幌市）',
      type: '石狩川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture/ishikarigawa_l1/tileset.json',
    },
    {
      name: '石狩川水系石狩川下流洪水浸水想定区域（札幌市）',
      type: '石狩川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture/ishikarigawa_l2/tileset.json',
    },
    {
      name: '石狩川水系豊平川浸水想定区域（札幌市）',
      type: '豊平川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/notexture/toyohiragawa_l1/tileset.json',
    },
    {
      name: '石狩川水系豊平川浸水想定区域（札幌市）',
      type: '豊平川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/notexture/toyohiragawa_l2/tileset.json',
    },
    {
      name: '石狩川水系豊平川浸水想定区域（札幌市）',
      type: '豊平川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture/toyohiragawa_l1/tileset.json',
    },
    {
      name: '石狩川水系豊平川浸水想定区域（札幌市）',
      type: '豊平川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture/toyohiragawa_l2/tileset.json',
    },
    {
      name: '石狩川水系厚別川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '厚別川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/notexture/atsubetsugawa_n_l1/tileset.json',
    },
    {
      name: '石狩川水系厚別川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '厚別川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/notexture/atsubetsugawa_n_l2/tileset.json',
    },
    {
      name: '石狩川水系厚別川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '厚別川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture/atsubetsugawa_n_l1/tileset.json',
    },
    {
      name: '石狩川水系厚別川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '厚別川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture/atsubetsugawa_n_l2/tileset.json',
    },
    {
      name: '石狩川水系月寒川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '月寒川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/notexture/tsukisamukawa_n_l1/tileset.json',
    },
    {
      name: '石狩川水系月寒川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '月寒川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/notexture/tsukisamukawa_n_l2/tileset.json',
    },
    {
      name: '石狩川水系月寒川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '月寒川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture/tsukisamukawa_n_l1/tileset.json',
    },
    {
      name: '石狩川水系月寒川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '月寒川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture/tsukisamukawa_n_l2/tileset.json',
    },
    {
      name: '石狩川水系望月寒川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '望月寒川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/notexture/motsukisamukawa_n_l1/tileset.json',
    },
    {
      name: '石狩川水系望月寒川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '望月寒川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/notexture/motsukisamukawa_n_l2/tileset.json',
    },
    {
      name: '石狩川水系望月寒川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '望月寒川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture/motsukisamukawa_n_l1/tileset.json',
    },
    {
      name: '石狩川水系望月寒川洪水浸水想定区域（直轄管理区間）（札幌市）',
      type: '望月寒川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture/motsukisamukawa_n_l2/tileset.json',
    },
    {
      name: '新川水系新川浸水想定区域（札幌市）',
      type: '新川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/shinkawa_l1/tileset.json',
    },
    {
      name: '新川水系新川浸水想定区域（札幌市）',
      type: '新川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/shinkawa_l2/tileset.json',
    },
    {
      name: '新川水系新川浸水想定区域（札幌市）',
      type: '新川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/shinkawa_l1/tileset.json',
    },
    {
      name: '新川水系新川浸水想定区域（札幌市）',
      type: '新川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/shinkawa_l2/tileset.json',
    },
    {
      name: '新川水系中の川浸水想定区域（札幌市）',
      type: '中の川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/nakanokawa_l1/tileset.json',
    },
    {
      name: '新川水系中の川浸水想定区域（札幌市）',
      type: '中の川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/nakanokawa_l2/tileset.json',
    },
    {
      name: '新川水系中の川浸水想定区域（札幌市）',
      type: '中の川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/nakanokawa_l1/tileset.json',
    },
    {
      name: '新川水系中の川浸水想定区域（札幌市）',
      type: '中の川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/nakanokawa_l2/tileset.json',
    },
    {
      name: '新川水系琴似川浸水想定区域（札幌市）',
      type: '琴似川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/kotonikawa_l1/tileset.json',
    },
    {
      name: '新川水系琴似川浸水想定区域（札幌市）',
      type: '琴似川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/kotonikawa_l2/tileset.json',
    },
    {
      name: '新川水系琴似川浸水想定区域（札幌市）',
      type: '琴似川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/kotonikawa_l1/tileset.json',
    },
    {
      name: '新川水系琴似川浸水想定区域（札幌市）',
      type: '琴似川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/kotonikawa_l2/tileset.json',
    },
    {
      name: '新川水系琴似発寒川浸水想定区域（札幌市）',
      type: '琴似発寒川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/kotonihassamugawa_l1/tileset.json',
    },
    {
      name: '新川水系琴似発寒川浸水想定区域（札幌市）',
      type: '琴似発寒川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/kotonihassamugawa_l2/tileset.json',
    },
    {
      name: '新川水系琴似発寒川浸水想定区域（札幌市）',
      type: '琴似発寒川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/kotonihassamugawa_l1/tileset.json',
    },
    {
      name: '新川水系琴似発寒川浸水想定区域（札幌市）',
      type: '琴似発寒川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/kotonihassamugawa_l2/tileset.json',
    },
    {
      name: '石狩川水系望月寒川洪水浸水想定区域（札幌市）',
      type: '望月寒川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/motsukisamukawa_l1/tileset.json',
    },
    {
      name: '石狩川水系望月寒川洪水浸水想定区域（札幌市）',
      type: '望月寒川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/motsukisamukawa_l2/tileset.json',
    },
    {
      name: '石狩川水系望月寒川洪水浸水想定区域（札幌市）',
      type: '望月寒川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/motsukisamukawa_l1/tileset.json',
    },
    {
      name: '石狩川水系望月寒川洪水浸水想定区域（札幌市）',
      type: '望月寒川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/motsukisamukawa_l2/tileset.json',
    },
    {
      name: '石狩川水系厚別川洪水浸水想定区域（札幌市）',
      type: '厚別川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/atsubetsugawa_l1/tileset.json',
    },
    {
      name: '石狩川水系厚別川洪水浸水想定区域（札幌市）',
      type: '厚別川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/atsubetsugawa_l2/tileset.json',
    },
    {
      name: '石狩川水系厚別川洪水浸水想定区域（札幌市）',
      type: '厚別川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/atsubetsugawa_l1/tileset.json',
    },
    {
      name: '石狩川水系厚別川洪水浸水想定区域（札幌市）',
      type: '厚別川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/atsubetsugawa_l2/tileset.json',
    },
    {
      name: '石狩川水系野津幌川洪水浸水想定区域（札幌市）',
      type: '野津幌川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/nopporokawa_l1/tileset.json',
    },
    {
      name: '石狩川水系野津幌川洪水浸水想定区域（札幌市）',
      type: '野津幌川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/nopporokawa_l2/tileset.json',
    },
    {
      name: '石狩川水系野津幌川洪水浸水想定区域（札幌市）',
      type: '野津幌川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/nopporokawa_l1/tileset.json',
    },
    {
      name: '石狩川水系野津幌川洪水浸水想定区域（札幌市）',
      type: '野津幌川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/nopporokawa_l2/tileset.json',
    },
    {
      name: '石狩川水系月寒川洪水浸水想定区域（札幌市）',
      type: '月寒川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/tsukisamukawa_l1/tileset.json',
    },
    {
      name: '石狩川水系月寒川洪水浸水想定区域（札幌市）',
      type: '月寒川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/tsukisamukawa_l2/tileset.json',
    },
    {
      name: '石狩川水系月寒川洪水浸水想定区域（札幌市）',
      type: '月寒川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/tsukisamukawa_l1/tileset.json',
    },
    {
      name: '石狩川水系月寒川洪水浸水想定区域（札幌市）',
      type: '月寒川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/tsukisamukawa_l2/tileset.json',
    },
    {
      name: '石狩川水系精進川洪水浸水想定区域（札幌市）',
      type: '精進川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/shojinkawa_l1/tileset.json',
    },
    {
      name: '石狩川水系精進川洪水浸水想定区域（札幌市）',
      type: '精進川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/shojinkawa_l2/tileset.json',
    },
    {
      name: '石狩川水系精進川洪水浸水想定区域（札幌市）',
      type: '精進川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/shojinkawa_l1/tileset.json',
    },
    {
      name: '石狩川水系精進川洪水浸水想定区域（札幌市）',
      type: '精進川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/shojinkawa_l2/tileset.json',
    },
    {
      name: '石狩川水系豊平川（上流部）洪水浸水想定区域（札幌市）',
      type: '豊平川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/toyohiragawa_upper_l1/tileset.json',
    },
    {
      name: '石狩川水系豊平川（上流部）洪水浸水想定区域（札幌市）',
      type: '豊平川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/toyohiragawa_upper_l2/tileset.json',
    },
    {
      name: '石狩川水系豊平川（上流部）洪水浸水想定区域（札幌市）',
      type: '豊平川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/toyohiragawa_upper_l1/tileset.json',
    },
    {
      name: '石狩川水系豊平川（上流部）洪水浸水想定区域（札幌市）',
      type: '豊平川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/toyohiragawa_upper_l2/tileset.json',
    },
    {
      name: '星置川水系星置川洪水浸水想定区域（札幌市）',
      type: '星置川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/tsukisamukawa_l1/tileset.json',
    },
    {
      name: '星置川水系星置川洪水浸水想定区域（札幌市）',
      type: '星置川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/pref/hoshiokigawa_l2/tileset.json',
    },
    {
      name: '星置川水系星置川洪水浸水想定区域（札幌市）',
      type: '星置川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/hoshiokigawa_l1/tileset.json',
    },
    {
      name: '星置川水系星置川洪水浸水想定区域（札幌市）',
      type: '星置川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/01100_sapporo/texture_pref/hoshiokigawa_l2/tileset.json',
    },
    {
      name: '北海道津波浸水想定区域（札幌市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/01100_sapporo/notexture/tileset.json',
    },
    {
      name: '北海道津波浸水想定区域（札幌市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/01100_sapporo/texture/tileset.json',
    },
    {
      name: '建物モデル（郡山市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/07203_koriyama/notexture/tileset.json',
    },
    {
      name: '建物モデル（郡山市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/07203_koriyama/texture/tileset.json',
    },
    {
      name: '建物モデル（郡山市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/07203_koriyama/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（いわき市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/07204_iwaki/notexture/tileset.json',
    },
    {
      name: '建物モデル（いわき市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/07204_iwaki/texture/tileset.json',
    },
    {
      name: '建物モデル（いわき市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/07204_iwaki/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（白河市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/07205_shirakawa/notexture/tileset.json',
    },
    {
      name: '建物モデル（白河市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/07205_shirakawa/texture/tileset.json',
    },
    {
      name: '建物モデル（白河市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/07205_shirakawa/low_resolution/tileset.json',
    },
    {
      name: '阿武隈川水系阿武隈川浸水想定区域（郡山市）',
      type: '阿武隈川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07203_koriyama/notexture/abukumagawa_l1/tileset.json',
    },
    {
      name: '阿武隈川水系阿武隈川浸水想定区域（郡山市）',
      type: '阿武隈川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07203_koriyama/notexture/abukumagawa_l2/tileset.json',
    },
    {
      name: '阿武隈川水系阿武隈川浸水想定区域（郡山市）',
      type: '阿武隈川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07203_koriyama/texture/abukumagawa_l1/tileset.json',
    },
    {
      name: '阿武隈川水系阿武隈川浸水想定区域（郡山市）',
      type: '阿武隈川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07203_koriyama/texture/abukumagawa_l2/tileset.json',
    },
    {
      name: '阿武隈川水系逢瀬川浸水想定区域（郡山市）',
      type: '逢瀬川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07203_koriyama/pref/ousegawa_l1/tileset.json',
    },
    {
      name: '阿武隈川水系逢瀬川浸水想定区域（郡山市）',
      type: '逢瀬川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07203_koriyama/pref/ousegawa_l2/tileset.json',
    },
    {
      name: '阿武隈川水系逢瀬川浸水想定区域（郡山市）',
      type: '逢瀬川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07203_koriyama/texture_pref/ousegawa_l1/tileset.json',
    },
    {
      name: '阿武隈川水系逢瀬川浸水想定区域（郡山市）',
      type: '逢瀬川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07203_koriyama/texture_pref/ousegawa_l2/tileset.json',
    },
    {
      name: '夏井川水系夏井川浸水想定区域（いわき市）',
      type: '夏井川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/pref/natsuigawa_l1/tileset.json',
    },
    {
      name: '夏井川水系夏井川浸水想定区域（いわき市）',
      type: '夏井川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/pref/natsuigawa_l2/tileset.json',
    },
    {
      name: '夏井川水系夏井川浸水想定区域（いわき市）',
      type: '夏井川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/texture_pref/natsuigawa_l1/tileset.json',
    },
    {
      name: '夏井川水系夏井川浸水想定区域（いわき市）',
      type: '夏井川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/texture_pref/natsuigawa_l2/tileset.json',
    },
    {
      name: '夏井川水系新川浸水想定区域（いわき市）',
      type: '新川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/pref/shinkawa_l1/tileset.json',
    },
    {
      name: '夏井川水系新川浸水想定区域（いわき市）',
      type: '新川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/pref/shinkawa_l2/tileset.json',
    },
    {
      name: '夏井川水系新川浸水想定区域（いわき市）',
      type: '新川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/texture_pref/shinkawa_l1/tileset.json',
    },
    {
      name: '夏井川水系新川浸水想定区域（いわき市）',
      type: '新川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/texture_pref/shinkawa_l2/tileset.json',
    },
    {
      name: '夏井川水系好間川浸水想定区域（いわき市）',
      type: '好間川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/pref/yoshimagawa_l1/tileset.json',
    },
    {
      name: '夏井川水系好間川浸水想定区域（いわき市）',
      type: '好間川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/pref/yoshimagawa_l2/tileset.json',
    },
    {
      name: '夏井川水系好間川浸水想定区域（いわき市）',
      type: '好間川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/texture_pref/yoshimagawa_l1/tileset.json',
    },
    {
      name: '夏井川水系好間川浸水想定区域（いわき市）',
      type: '好間川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/texture_pref/yoshimagawa_l2/tileset.json',
    },
    {
      name: '夏井川水系仁井田川浸水想定区域（いわき市）',
      type: '仁井田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/pref/niidagawa_l1/tileset.json',
    },
    {
      name: '夏井川水系仁井田川浸水想定区域（いわき市）',
      type: '仁井田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/pref/niidagawa_l2/tileset.json',
    },
    {
      name: '夏井川水系仁井田川浸水想定区域（いわき市）',
      type: '仁井田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/texture_pref/niidagawa_l1/tileset.json',
    },
    {
      name: '夏井川水系仁井田川浸水想定区域（いわき市）',
      type: '仁井田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/texture_pref/niidagawa_l2/tileset.json',
    },
    {
      name: '鮫川水系鮫川浸水想定区域（いわき市）',
      type: '鮫川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/pref/samegawa_l1/tileset.json',
    },
    {
      name: '鮫川水系鮫川浸水想定区域（いわき市）',
      type: '鮫川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/pref/samegawa_l2/tileset.json',
    },
    {
      name: '鮫川水系鮫川浸水想定区域（いわき市）',
      type: '鮫川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/texture_pref/samegawa_l1/tileset.json',
    },
    {
      name: '鮫川水系鮫川浸水想定区域（いわき市）',
      type: '鮫川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07204_iwaki/texture_pref/samegawa_l1/tileset.json',
    },
    {
      name: '阿武隈川水系阿武隈川洪水浸水想定区域（白河市）',
      type: '阿武隈川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07205_shirakawa/pref/abukumagawa_l1/tileset.json',
    },
    {
      name: '阿武隈川水系阿武隈川洪水浸水想定区域（白河市）',
      type: '阿武隈川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07205_shirakawa/pref/abukumagawa_l2/tileset.json',
    },
    {
      name: '阿武隈川水系阿武隈川洪水浸水想定区域（白河市）',
      type: '阿武隈川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07205_shirakawa/texture_pref/abukumagawa_l1/tileset.json',
    },
    {
      name: '阿武隈川水系阿武隈川洪水浸水想定区域（白河市）',
      type: '阿武隈川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07205_shirakawa/texture_pref/abukumagawa_l2/tileset.json',
    },
    {
      name: '阿武隈川水系社川洪水浸水想定区域（白河市）',
      type: '社川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07205_shirakawa/pref/yashirogawa_l1/tileset.json',
    },
    {
      name: '阿武隈川水系社川洪水浸水想定区域（白河市）',
      type: '社川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07205_shirakawa/pref/yashirogawa_l2/tileset.json',
    },
    {
      name: '阿武隈川水系社川洪水浸水想定区域（白河市）',
      type: '社川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07205_shirakawa/texture_pref/yashirogawa_l1/tileset.json',
    },
    {
      name: '阿武隈川水系社川洪水浸水想定区域（白河市）',
      type: '社川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/07205_shirakawa/texture_pref/yashirogawa_l2/tileset.json',
    },
    {
      name: '福島県津波浸水想定区域（いわき市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/07204_iwaki/notexture/tileset.json',
    },
    {
      name: '福島県津波浸水想定区域（いわき市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/07204_iwaki/texture/tileset.json',
    },
    {
      name: '建物モデル（鉾田市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/08234_hokota/notexture/tileset.json',
    },
    {
      name: '利根川水系北浦洪水浸水想定区域（鉾田市）',
      type: '北浦L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/08234_hokota/notexture/kitaura_l1/tileset.json',
    },
    {
      name: '利根川水系北浦洪水浸水想定区域（鉾田市）',
      type: '北浦L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/08234_hokota/notexture/kitaura_l2/tileset.json',
    },
    {
      name: '利根川水系北浦洪水浸水想定区域（鉾田市）',
      type: '北浦L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/08234_hokota/texture/kitaura_l1/tileset.json',
    },
    {
      name: '利根川水系北浦洪水浸水想定区域（鉾田市）',
      type: '北浦L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/08234_hokota/texture/kitaura_l2/tileset.json',
    },
    {
      name: '利根川水系巴川洪水浸水想定区域（鉾田市）',
      type: '巴川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/08234_hokota/pref/tomoegawa_l1/tileset.json',
    },
    {
      name: '利根川水系巴川洪水浸水想定区域（鉾田市）',
      type: '巴川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/08234_hokota/pref/tomoegawa_l2/tileset.json',
    },
    {
      name: '利根川水系巴川洪水浸水想定区域（鉾田市）',
      type: '巴川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/08234_hokota/texture_pref/tomoegawa_l1/tileset.json',
    },
    {
      name: '利根川水系巴川洪水浸水想定区域（鉾田市）',
      type: '巴川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/08234_hokota/texture_pref/tomoegawa_l2/tileset.json',
    },
    {
      name: '茨城県津波浸水想定区域（鉾田市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/08234_hokota/notexture/tileset.json',
    },
    {
      name: '茨城県津波浸水想定区域（鉾田市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/08234_hokota/texture/tileset.json',
    },
    {
      name: '建物モデル（宇都宮市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/09201_utsunomiya/notexture/tileset.json',
    },
    {
      name: '建物モデル（宇都宮市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/09201_utsunomiya/texture/tileset.json',
    },
    {
      name: '建物モデル（宇都宮市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/09201_utsunomiya/low_resolution/tileset.json',
    },
    {
      name: '利根川水系鬼怒川洪水浸水想定区域（宇都宮市）',
      type: '鬼怒川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/notexture/kinugawa_l1/tileset.json',
    },
    {
      name: '利根川水系鬼怒川洪水浸水想定区域（宇都宮市）',
      type: '鬼怒川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/notexture/kinugawa_l2/tileset.json',
    },
    {
      name: '利根川水系鬼怒川洪水浸水想定区域（宇都宮市）',
      type: '鬼怒川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/texture/kinugawa_l1/tileset.json',
    },
    {
      name: '利根川水系鬼怒川洪水浸水想定区域（宇都宮市）',
      type: '鬼怒川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/texture/kinugawa_l2/tileset.json',
    },
    {
      name: '利根川水系田川浸水リスク想定図（宇都宮市）',
      type: '田川浸水リスクL2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/pref/tagawa_risk_l2/tileset.json',
    },
    {
      name: '利根川水系田川浸水リスク想定図（宇都宮市）',
      type: '田川浸水リスクL2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/texture_pref/tagawa_risk_l2/tileset.json',
    },
    {
      name: '利根川水系姿川浸水リスク想定図（宇都宮市）',
      type: '姿川浸水リスクL2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/pref/sugatagawa_risk_l2/tileset.json',
    },
    {
      name: '利根川水系姿川浸水リスク想定図（宇都宮市）',
      type: '姿川浸水リスクL2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/texture_pref/sugatagawa_risk_l2/tileset.json',
    },
    {
      name: '利根川水系田川洪水浸水想定区域（宇都宮市）',
      type: '田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/pref/tagawa_l1/tileset.json',
    },
    {
      name: '利根川水系田川洪水浸水想定区域（宇都宮市）',
      type: '田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/pref/tagawa_l2/tileset.json',
    },
    {
      name: '利根川水系田川洪水浸水想定区域（宇都宮市）',
      type: '田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/texture_pref/tagawa_l1/tileset.json',
    },
    {
      name: '利根川水系田川洪水浸水想定区域（宇都宮市）',
      type: '田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/texture_pref/tagawa_l2/tileset.json',
    },
    {
      name: '利根川水系姿川洪水浸水想定区域（宇都宮市）',
      type: '姿川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/pref/sugatagawa_l1/tileset.json',
    },
    {
      name: '利根川水系姿川洪水浸水想定区域（宇都宮市）',
      type: '姿川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/pref/sugatagawa_l2/tileset.json',
    },
    {
      name: '利根川水系姿川洪水浸水想定区域（宇都宮市）',
      type: '姿川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/texture_pref/sugatagawa_l1/tileset.json',
    },
    {
      name: '利根川水系姿川洪水浸水想定区域（宇都宮市）',
      type: '姿川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/09201_utsunomiya/texture_pref/sugatagawa_l2/tileset.json',
    },
    {
      name: '建物モデル（桐生市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/10203_kiryu/notexture/tileset.json',
    },
    {
      name: '建物モデル（桐生市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/10203_kiryu/texture/tileset.json',
    },
    {
      name: '建物モデル（桐生市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/10203_kiryu/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（館林市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/10207_tatebayashi/notexture/tileset.json',
    },
    {
      name: '建物モデル（館林市）',
      type: 'テクスチャ付き（屋根のみ）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/10207_tatebayashi/texture/tileset.json',
    },
    {
      name: '建物モデル（館林市）',
      type: 'テクスチャ付き（屋根のみ・低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/10207_tatebayashi/low_resolution/tileset.json',
    },
    {
      name: '利根川水系渡良瀬川洪水浸水想定区域（桐生市）',
      type: '渡良瀬川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10203_kiryu/notexture/watarasegawa_l1/tileset.json',
    },
    {
      name: '利根川水系渡良瀬川洪水浸水想定区域（桐生市）',
      type: '渡良瀬川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10203_kiryu/notexture/watarasegawa_l2/tileset.json',
    },
    {
      name: '利根川水系渡良瀬川洪水浸水想定区域（桐生市）',
      type: '渡良瀬川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10203_kiryu/texture/watarasegawa_l1/tileset.json',
    },
    {
      name: '利根川水系渡良瀬川洪水浸水想定区域（桐生市）',
      type: '渡良瀬川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10203_kiryu/texture/watarasegawa_l2/tileset.json',
    },
    {
      name: '利根川水系桐生川洪水浸水想定区域（直轄管理区間）（桐生市）',
      type: '桐生川（直轄管理区間）L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10203_kiryu/notexture/kiryugawa_n_l1/tileset.json',
    },
    {
      name: '利根川水系桐生川洪水浸水想定区域（直轄管理区間）（桐生市）',
      type: '桐生川（直轄管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10203_kiryu/notexture/kiryugawa_n_l2/tileset.json',
    },
    {
      name: '利根川水系桐生川洪水浸水想定区域（直轄管理区間）（桐生市）',
      type: '桐生川（直轄管理区間）L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10203_kiryu/texture/kiryugawa_n_l1/tileset.json',
    },
    {
      name: '利根川水系桐生川洪水浸水想定区域（直轄管理区間）（桐生市）',
      type: '桐生川（直轄管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10203_kiryu/texture/kiryugawa_n_l2/tileset.json',
    },
    {
      name: '利根川水系桐生川洪水浸水想定区域（県管理区間）（桐生市）',
      type: '桐生川（県管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10203_kiryu/pref/kiryugawa_l2/tileset.json',
    },
    {
      name: '利根川水系桐生川洪水浸水想定区域（県管理区間）（桐生市）',
      type: '桐生川（県管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10203_kiryu/texture_pref/kiryugawa_l2/tileset.json',
    },
    {
      name: '利根川水系渡良瀬川洪水浸水想定区域（館林市）',
      type: '渡良瀬川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/watarasegawa_l1/tileset.json',
    },
    {
      name: '利根川水系渡良瀬川洪水浸水想定区域（館林市）',
      type: '渡良瀬川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/watarasegawa_l2/tileset.json',
    },
    {
      name: '利根川水系渡良瀬川洪水浸水想定区域（館林市）',
      type: '渡良瀬川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/watarasegawa_l1/tileset.json',
    },
    {
      name: '利根川水系渡良瀬川洪水浸水想定区域（館林市）',
      type: '渡良瀬川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/watarasegawa_l2/tileset.json',
    },
    {
      name: '利根川水系矢場川浸水想定区域（館林市）',
      type: '矢場川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/yabagawa_l1/tileset.json',
    },
    {
      name: '利根川水系矢場川浸水想定区域（館林市）',
      type: '矢場川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/yabagawa_l2/tileset.json',
    },
    {
      name: '利根川水系矢場川浸水想定区域（館林市）',
      type: '矢場川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/yabagawa_l1/tileset.json',
    },
    {
      name: '利根川水系矢場川浸水想定区域（館林市）',
      type: '矢場川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/yabagawa_l2/tileset.json',
    },
    {
      name: '利根川水系多々良川浸水想定区域（館林市）',
      type: '多々良川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/tataragawa_l1/tileset.json',
    },
    {
      name: '利根川水系多々良川浸水想定区域（館林市）',
      type: '多々良川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/tataragawa_l2/tileset.json',
    },
    {
      name: '利根川水系多々良川浸水想定区域（館林市）',
      type: '多々良川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/tataragawa_l1/tileset.json',
    },
    {
      name: '利根川水系多々良川浸水想定区域（館林市）',
      type: '多々良川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/tataragawa_l2/tileset.json',
    },
    {
      name: '利根川水系利根川浸水想定区域（館林市）',
      type: '利根川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/tonegawa_l1/tileset.json',
    },
    {
      name: '利根川水系利根川浸水想定区域（館林市）',
      type: '利根川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/tonegawa_l2/tileset.json',
    },
    {
      name: '利根川水系利根川浸水想定区域（館林市）',
      type: '利根川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/tonegawa_l1/tileset.json',
    },
    {
      name: '利根川水系利根川浸水想定区域（館林市）',
      type: '利根川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/tonegawa_l2/tileset.json',
    },
    {
      name: '利根川水系旗川洪水浸水想定区域（館林市）',
      type: '旗川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/hatagawa_l1/tileset.json',
    },
    {
      name: '利根川水系旗川洪水浸水想定区域（館林市）',
      type: '旗川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/hatagawa_l2/tileset.json',
    },
    {
      name: '利根川水系旗川洪水浸水想定区域（館林市）',
      type: '旗川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/hatagawa_l1/tileset.json',
    },
    {
      name: '利根川水系旗川洪水浸水想定区域（館林市）',
      type: '旗川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/hatagawa_l2/tileset.json',
    },
    {
      name: '利根川水系秋山川洪水浸水想定区域（館林市）',
      type: '秋山川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/akiyamagawa_l1/tileset.json',
    },
    {
      name: '利根川水系秋山川洪水浸水想定区域（館林市）',
      type: '秋山川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/notexture/akiyamagawa_l2/tileset.json',
    },
    {
      name: '利根川水系秋山川洪水浸水想定区域（館林市）',
      type: '秋山川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/akiyamagawa_l1/tileset.json',
    },
    {
      name: '利根川水系秋山川洪水浸水想定区域（館林市）',
      type: '秋山川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture/akiyamagawa_l2/tileset.json',
    },
    {
      name: '利根川水系谷田川浸水想定区域（館林市）',
      type: '谷田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/pref/yatagawa_l1/tileset.json',
    },
    {
      name: '利根川水系谷田川浸水想定区域（館林市）',
      type: '谷田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/pref/yatagawa_l2/tileset.json',
    },
    {
      name: '利根川水系谷田川浸水想定区域（館林市）',
      type: '谷田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture_pref/yatagawa_l1/tileset.json',
    },
    {
      name: '利根川水系谷田川浸水想定区域（館林市）',
      type: '谷田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/10207_tatebayashi/texture_pref/yatagawa_l2/tileset.json',
    },
    {
      name: '建物モデル（さいたま市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11100_saitama/notexture/tileset.json',
    },
    {
      name: '建物モデル（さいたま市）',
      type: 'テクスチャ付き（屋根のみ）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11100_saitama/texture/tileset.json',
    },
    {
      name: '建物モデル（さいたま市）',
      type: 'テクスチャ付き（屋根のみ・低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11100_saitama/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（熊谷市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11202_kumagaya/notexture/tileset.json',
    },
    {
      name: '建物モデル（熊谷市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11202_kumagaya/texture/tileset.json',
    },
    {
      name: '建物モデル（熊谷市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11202_kumagaya/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（新座市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11230_niiza/notexture/tileset.json',
    },
    {
      name: '建物モデル（新座市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11230_niiza/texture/tileset.json',
    },
    {
      name: '建物モデル（新座市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11230_niiza/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（毛呂山町）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11326_moroyama/notexture/tileset.json',
    },
    {
      name: '建物モデル（毛呂山町）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11326_moroyama/texture/tileset.json',
    },
    {
      name: '建物モデル（毛呂山町）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/11326_moroyama/low_resolution/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（熊谷市）',
      type: '荒川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/notexture/arakawa_l1/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（熊谷市）',
      type: '荒川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/notexture/arakawa_l2/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（熊谷市）',
      type: '荒川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture/arakawa_l1/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（熊谷市）',
      type: '荒川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture/arakawa_l2/tileset.json',
    },
    {
      name: '利根川水系利根川洪水浸水想定区域（熊谷市）',
      type: '利根川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/notexture/tonegawa_l1/tileset.json',
    },
    {
      name: '利根川水系利根川洪水浸水想定区域（熊谷市）',
      type: '利根川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/notexture/tonegawa_l2/tileset.json',
    },
    {
      name: '利根川水系利根川洪水浸水想定区域（熊谷市）',
      type: '利根川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture/tonegawa_l1/tileset.json',
    },
    {
      name: '利根川水系利根川洪水浸水想定区域（熊谷市）',
      type: '利根川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture/tonegawa_l2/tileset.json',
    },
    {
      name: '利根川水系広瀬川洪水浸水想定区域（熊谷市）',
      type: '広瀬川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/notexture/hirosegawa_l2/tileset.json',
    },
    {
      name: '利根川水系広瀬川洪水浸水想定区域（熊谷市）',
      type: '広瀬川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture/hirosegawa_l2/tileset.json',
    },
    {
      name: '利根川水系小山川洪水浸水想定区域（国管理区間）（熊谷市）',
      type: '小山川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/notexture/koyamagawa_n_l2/tileset.json',
    },
    {
      name: '利根川水系小山川洪水浸水想定区域（国管理区間）（熊谷市）',
      type: '小山川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture/koyamagawa_n_l2/tileset.json',
    },
    {
      name: '利根川水系早川洪水浸水想定区域（国管理区間）（熊谷市）',
      type: '早川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/notexture/hayakawa_n_l1/tileset.json',
    },
    {
      name: '利根川水系早川洪水浸水想定区域（国管理区間）（熊谷市）',
      type: '早川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/notexture/hayakawa_n_l2/tileset.json',
    },
    {
      name: '利根川水系早川洪水浸水想定区域（国管理区間）（熊谷市）',
      type: '早川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture/hayakawa_n_l1/tileset.json',
    },
    {
      name: '利根川水系早川洪水浸水想定区域（国管理区間）（熊谷市）',
      type: '早川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture/hayakawa_n_l2/tileset.json',
    },
    {
      name: '利根川水系小山川洪水浸水想定区域・水害リスク情報図(県管理区間)（熊谷市）',
      type: '小山川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/koyamagawa_l1/tileset.json',
    },
    {
      name: '利根川水系小山川洪水浸水想定区域・水害リスク情報図(県管理区間)（熊谷市）',
      type: '小山川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/koyamagawa_l2/tileset.json',
    },
    {
      name: '利根川水系小山川洪水浸水想定区域・水害リスク情報図(県管理区間)（熊谷市）',
      type: '小山川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/koyamagawa_l1/tileset.json',
    },
    {
      name: '利根川水系小山川洪水浸水想定区域・水害リスク情報図(県管理区間)（熊谷市）',
      type: '小山川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/koyamagawa_l2/tileset.json',
    },
    {
      name: '利根川水系福川洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '福川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/fukukawa_l1/tileset.json',
    },
    {
      name: '利根川水系福川洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '福川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/fukukawa_l2/tileset.json',
    },
    {
      name: '利根川水系福川洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '福川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/fukukawa_l1/tileset.json',
    },
    {
      name: '利根川水系福川洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '福川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/fukukawa_l2/tileset.json',
    },
    {
      name: '荒川水系市野川流域洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '市野川流域L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/ichinokawa_l1/tileset.json',
    },
    {
      name: '荒川水系市野川流域洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '市野川流域L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/ichinokawa_l2/tileset.json',
    },
    {
      name: '荒川水系市野川流域洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '市野川流域L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/ichinokawa_l1/tileset.json',
    },
    {
      name: '荒川水系市野川流域洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '市野川流域L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/ichinokawa_l2/tileset.json',
    },
    {
      name: '荒川水系吉野川流域水害リスク情報図（熊谷市）',
      type: '吉野川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/yoshinogawa_basin_l2/tileset.json',
    },
    {
      name: '荒川水系吉野川流域水害リスク情報図（熊谷市）',
      type: '吉野川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/yoshinogawa_basin_l2/tileset.json',
    },
    {
      name: '荒川水系和田吉野川流域水害リスク情報図（熊谷市）',
      type: '和田吉野川流域L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/wadayoshinogawa_l1/tileset.json',
    },
    {
      name: '荒川水系和田吉野川流域水害リスク情報図（熊谷市）',
      type: '和田吉野川流域L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/wadayoshinogawa_l2/tileset.json',
    },
    {
      name: '荒川水系和田吉野川流域水害リスク情報図（熊谷市）',
      type: '和田吉野川流域L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/wadayoshinogawa_l1/tileset.json',
    },
    {
      name: '荒川水系和田吉野川流域水害リスク情報図（熊谷市）',
      type: '和田吉野川流域L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/wadayoshinogawa_l2/tileset.json',
    },
    {
      name: '利根川水系石田川・蛇川洪水浸水想定区域（熊谷市）',
      type: '石田川・蛇川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/ishidagawa_etc_l2/tileset.json',
    },
    {
      name: '利根川水系石田川・蛇川洪水浸水想定区域（熊谷市）',
      type: '石田川・蛇川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/ishidagawa_etc_l2/tileset.json',
    },
    {
      name: '利根川水系中川洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '中川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/nakagawa_l1/tileset.json',
    },
    {
      name: '利根川水系中川洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '中川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/nakagawa_l2/tileset.json',
    },
    {
      name: '利根川水系中川洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '中川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/nakagawa_l1/tileset.json',
    },
    {
      name: '利根川水系中川洪水浸水想定区域・水害リスク情報図（熊谷市）',
      type: '中川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/nakagawa_l2/tileset.json',
    },
    {
      name: '利根川水系早川洪水浸水想定区域（県管理区間）（熊谷市）',
      type: '早川（県管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/pref/hayakawa_l2/tileset.json',
    },
    {
      name: '利根川水系早川洪水浸水想定区域（県管理区間）（熊谷市）',
      type: '早川（県管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11202_kumagaya/texture_pref/hayakawa_l2/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（新座市）',
      type: '荒川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11230_niiza/notexture/yanasegawa_l1/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（新座市）',
      type: '荒川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11230_niiza/notexture/yanasegawa_l2/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（新座市）',
      type: '荒川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11230_niiza/texture/yanasegawa_l1/tileset.json',
    },
    {
      name: '荒川水系荒川洪水浸水想定区域（新座市）',
      type: '荒川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11230_niiza/texture/yanasegawa_l2/tileset.json',
    },
    {
      name: '荒川水系新河岸川洪水浸水想定区域（新座市）',
      type: '新河岸川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11230_niiza/pref/shingashigawa_l1/tileset.json',
    },
    {
      name: '荒川水系新河岸川洪水浸水想定区域（新座市）',
      type: '新河岸川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11230_niiza/pref/shingashigawa_l2/tileset.json',
    },
    {
      name: '荒川水系新河岸川洪水浸水想定区域（新座市）',
      type: '新河岸川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11230_niiza/texture_pref/shingashigawa_l1/tileset.json',
    },
    {
      name: '荒川水系新河岸川洪水浸水想定区域（新座市）',
      type: '新河岸川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11230_niiza/texture_pref/shingashigawa_l2/tileset.json',
    },
    {
      name: '荒川水系越辺川浸水想定区域（毛呂山町）',
      type: '越辺川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11326_moroyama/notexture/oppegawa_l1/tileset.json',
    },
    {
      name: '荒川水系越辺川浸水想定区域（毛呂山町）',
      type: '越辺川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11326_moroyama/notexture/oppegawa_l2/tileset.json',
    },
    {
      name: '荒川水系越辺川浸水想定区域（毛呂山町）',
      type: '越辺川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11326_moroyama/texture/oppegawa_l1/tileset.json',
    },
    {
      name: '荒川水系越辺川浸水想定区域（毛呂山町）',
      type: '越辺川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11326_moroyama/texture/oppegawa_l2/tileset.json',
    },
    {
      name: '荒川水系高麗川洪水浸水想定区域（毛呂山町）',
      type: '高麗川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11326_moroyama/notexture/komagawa_l2/tileset.json',
    },
    {
      name: '荒川水系高麗川洪水浸水想定区域（毛呂山町）',
      type: '高麗川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/11326_moroyama/texture/komagawa_l2/tileset.json',
    },
    {
      name: '建物モデル（柏市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/12217_kashiwa/notexture/tileset.json',
    },
    {
      name: '建物モデル（柏市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/12217_kashiwa/texture/tileset.json',
    },
    {
      name: '建物モデル（柏市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/12217_kashiwa/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（横浜市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14100_yokohama/notexture/tileset.json',
    },
    {
      name: '建物モデル（横浜市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14100_yokohama/texture/tileset.json',
    },
    {
      name: '建物モデル（横浜市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14100_yokohama/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（川崎市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14130_kawasaki/notexture/tileset.json',
    },
    {
      name: '建物モデル（相模原市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14150_sagamihara/notexture/tileset.json',
    },
    {
      name: '建物モデル（横須賀市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14201_yokosuka/notexture/tileset.json',
    },
    {
      name: '建物モデル（横須賀市）',
      type: 'テクスチャ付き（屋根のみ）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14201_yokosuka/texture/tileset.json',
    },
    {
      name: '建物モデル（横須賀市）',
      type: 'テクスチャ付き（屋根のみ・低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14201_yokosuka/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（箱根町）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14382_hakone/notexture/tileset.json',
    },
    {
      name: '多摩川水系多摩川、浅川、大栗川浸水想定区域（川崎市）',
      type: '多摩川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/tamagawa_l1/tileset.json',
    },
    {
      name: '多摩川水系多摩川、浅川、大栗川浸水想定区域（川崎市）',
      type: '多摩川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/tamagawa_l2/tileset.json',
    },
    {
      name: '多摩川水系多摩川、浅川、大栗川浸水想定区域（川崎市）',
      type: '多摩川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/tamagawa_l1/tileset.json',
    },
    {
      name: '多摩川水系多摩川、浅川、大栗川浸水想定区域（川崎市）',
      type: '多摩川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/tamagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系鳥山川洪水浸水想定区域（川崎市）',
      type: '鳥山川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/toriyamagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系鳥山川洪水浸水想定区域（川崎市）',
      type: '鳥山川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/toriyamagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系鳥山川洪水浸水想定区域（川崎市）',
      type: '鳥山川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/toriyamagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系鳥山川洪水浸水想定区域（川崎市）',
      type: '鳥山川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/toriyamagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系恩田川浸水想定区域（川崎市）',
      type: '恩田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/ondagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系恩田川浸水想定区域（川崎市）',
      type: '恩田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/ondagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系恩田川浸水想定区域（川崎市）',
      type: '恩田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/ondagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系恩田川浸水想定区域（川崎市）',
      type: '恩田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/ondagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系砂田川浸水想定区域（川崎市）',
      type: '砂田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/sunadagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系砂田川浸水想定区域（川崎市）',
      type: '砂田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/sunadagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系砂田川浸水想定区域（川崎市）',
      type: '砂田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/sunadagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系砂田川浸水想定区域（川崎市）',
      type: '砂田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/sunadagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系早淵川浸水想定区域（川崎市）',
      type: '早淵川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/hayabuchigawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系早淵川浸水想定区域（川崎市）',
      type: '早淵川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/hayabuchigawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系早淵川浸水想定区域（川崎市）',
      type: '早淵川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/hayabuchigawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系早淵川浸水想定区域（川崎市）',
      type: '早淵川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/hayabuchigawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系大熊川浸水想定区域（川崎市）',
      type: '大熊川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/okumagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系大熊川浸水想定区域（川崎市）',
      type: '大熊川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/okumagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系大熊川浸水想定区域（川崎市）',
      type: '大熊川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/okumagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系大熊川浸水想定区域（川崎市）',
      type: '大熊川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/okumagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系鶴見川浸水想定区域（川崎市）',
      type: '鶴見川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/tsurumigawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系鶴見川浸水想定区域（川崎市）',
      type: '鶴見川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/tsurumigawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系鶴見川浸水想定区域（川崎市）',
      type: '鶴見川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/tsurumigawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系鶴見川浸水想定区域（川崎市）',
      type: '鶴見川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/tsurumigawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系梅田川浸水想定区域（川崎市）',
      type: '梅田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/umedagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系梅田川浸水想定区域（川崎市）',
      type: '梅田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/umedagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系梅田川浸水想定区域（川崎市）',
      type: '梅田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/umedagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系梅田川浸水想定区域（川崎市）',
      type: '梅田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/umedagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系麻生川浸水想定区域（川崎市）',
      type: '麻生川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/asaogawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系麻生川浸水想定区域（川崎市）',
      type: '麻生川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/asaogawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系麻生川浸水想定区域（川崎市）',
      type: '麻生川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/asaogawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系麻生川浸水想定区域（川崎市）',
      type: '麻生川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/asaogawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系矢上川浸水想定区域（川崎市）',
      type: '矢上川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/yagamigawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系矢上川浸水想定区域（川崎市）',
      type: '矢上川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/yagamigawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系矢上川浸水想定区域（川崎市）',
      type: '矢上川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/yagamigawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系矢上川浸水想定区域（川崎市）',
      type: '矢上川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/yagamigawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系有馬川浸水想定区域（川崎市）',
      type: '有馬川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/arimagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系有馬川浸水想定区域（川崎市）',
      type: '有馬川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/notexture/arimagawa_l2/tileset.json',
    },
    {
      name: '鶴見川水系有馬川浸水想定区域（川崎市）',
      type: '有馬川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/arimagawa_l1/tileset.json',
    },
    {
      name: '鶴見川水系有馬川浸水想定区域（川崎市）',
      type: '有馬川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14130_kawasaki/texture/arimagawa_l2/tileset.json',
    },
    {
      name: '相模川水系相模川洪水浸水想定区域（相模原市）',
      type: '相模川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/sagamigawa_l1/tileset.json',
    },
    {
      name: '相模川水系相模川洪水浸水想定区域（相模原市）',
      type: '相模川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/sagamigawa_l2/tileset.json',
    },
    {
      name: '相模川水系相模川洪水浸水想定区域（相模原市）',
      type: '相模川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/sagamigawa_l1/tileset.json',
    },
    {
      name: '相模川水系相模川洪水浸水想定区域（相模原市）',
      type: '相模川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/sagamigawa_l2/tileset.json',
    },
    {
      name: '境川水系境川洪水浸水想定区域（相模原市）',
      type: '境川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/sakaigawa_l1/tileset.json',
    },
    {
      name: '境川水系境川洪水浸水想定区域（相模原市）',
      type: '境川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/sakaigawa_l2/tileset.json',
    },
    {
      name: '境川水系境川洪水浸水想定区域（相模原市）',
      type: '境川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/sakaigawa_l1/tileset.json',
    },
    {
      name: '境川水系境川洪水浸水想定区域（相模原市）',
      type: '境川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/sakaigawa_l2/tileset.json',
    },
    {
      name: '相模川水系鳩川洪水浸水想定区域（相模原市）',
      type: '鳩川（下流）L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/hatogawa_lower_l1/tileset.json',
    },
    {
      name: '相模川水系鳩川洪水浸水想定区域（相模原市）',
      type: '鳩川（下流）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/hatogawa_lower_l2/tileset.json',
    },
    {
      name: '相模川水系鳩川洪水浸水想定区域（相模原市）',
      type: '鳩川（下流）L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/hatogawa_lower_l1/tileset.json',
    },
    {
      name: '相模川水系鳩川洪水浸水想定区域（相模原市）',
      type: '鳩川（下流）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/hatogawa_lower_l2/tileset.json',
    },
    {
      name: '相模川水系鳩川・道保川洪水浸水想定区域（相模原市）',
      type: '鳩川（上流）・道保川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/hatogawa_upper_etc_l1/tileset.json',
    },
    {
      name: '相模川水系鳩川・道保川洪水浸水想定区域（相模原市）',
      type: '鳩川（上流）・道保川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/hatogawa_upper_etc_l2/tileset.json',
    },
    {
      name: '相模川水系鳩川・道保川洪水浸水想定区域（相模原市）',
      type: '鳩川（上流）・道保川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/hatogawa_upper_etc_l1/tileset.json',
    },
    {
      name: '相模川水系鳩川・道保川洪水浸水想定区域（相模原市）',
      type: '鳩川（上流）・道保川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/hatogawa_upper_etc_l2/tileset.json',
    },
    {
      name: '相模川水系串川洪水浸水想定区域（相模原市）',
      type: '串川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/kushikawa_etc_l1/tileset.json',
    },
    {
      name: '相模川水系串川洪水浸水想定区域（相模原市）',
      type: '串川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/kushikawa_etc_l2/tileset.json',
    },
    {
      name: '相模川水系串川洪水浸水想定区域（相模原市）',
      type: '串川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/kushikawa_etc_l1/tileset.json',
    },
    {
      name: '相模川水系串川洪水浸水想定区域（相模原市）',
      type: '串川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/kushikawa_etc_l2/tileset.json',
    },
    {
      name: '相模川水系道志川洪水浸水想定区域（相模原市）',
      type: '道志川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/doushigawa_l1/tileset.json',
    },
    {
      name: '相模川水系道志川洪水浸水想定区域（相模原市）',
      type: '道志川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/pref/doushigawa_l2/tileset.json',
    },
    {
      name: '相模川水系道志川洪水浸水想定区域（相模原市）',
      type: '道志川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/doushigawa_l1/tileset.json',
    },
    {
      name: '相模川水系道志川洪水浸水想定区域（相模原市）',
      type: '道志川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14150_sagamihara/texture_pref/doushigawa_l2/tileset.json',
    },
    {
      name: '平作川水系平作川洪水浸水想定区域（横須賀市）',
      type: '平作川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14201_yokosuka/pref/hirasakugawa_l1/tileset.json',
    },
    {
      name: '平作川水系平作川洪水浸水想定区域（横須賀市）',
      type: '平作川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14201_yokosuka/pref/hirasakugawa_l2/tileset.json',
    },
    {
      name: '平作川水系平作川洪水浸水想定区域（横須賀市）',
      type: '平作川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14201_yokosuka/texture_pref/hirasakugawa_l1/tileset.json',
    },
    {
      name: '平作川水系平作川洪水浸水想定区域（横須賀市）',
      type: '平作川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14201_yokosuka/texture_pref/hirasakugawa_l2/tileset.json',
    },
    {
      name: '松越川水系松越川・竹川洪水浸水想定区域（横須賀市）',
      type: '松越川・竹川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14201_yokosuka/pref/matsukoshigawa_etc_l1/tileset.json',
    },
    {
      name: '松越川水系松越川・竹川洪水浸水想定区域（横須賀市）',
      type: '松越川・竹川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14201_yokosuka/pref/matsukoshigawa_etc_l2/tileset.json',
    },
    {
      name: '松越川水系松越川・竹川洪水浸水想定区域（横須賀市）',
      type: '松越川・竹川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14201_yokosuka/texture_pref/matsukoshigawa_etc_l1/tileset.json',
    },
    {
      name: '松越川水系松越川・竹川洪水浸水想定区域（横須賀市）',
      type: '松越川・竹川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14201_yokosuka/texture_pref/matsukoshigawa_etc_l2/tileset.json',
    },
    {
      name: '鷹取川水系鷹取川洪水浸水想定区域（横須賀市）',
      type: '鷹取川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14201_yokosuka/pref/takatorigawa_l2/tileset.json',
    },
    {
      name: '鷹取川水系鷹取川洪水浸水想定区域（横須賀市）',
      type: '鷹取川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/14201_yokosuka/texture_pref/takatorigawa_l2/tileset.json',
    },
    {
      name: '神奈川県津波浸水想定区域図（川崎市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/14130_kawasaki/notexture/tileset.json',
    },
    {
      name: '神奈川県津波浸水想定区域図（川崎市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/14130_kawasaki/texture/tileset.json',
    },
    {
      name: '神奈川県津波浸水想定区域（横須賀市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/14201_yokosuka/notexture/tileset.json',
    },
    {
      name: '神奈川県津波浸水想定区域（横須賀市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/14201_yokosuka/texture/tileset.json',
    },
    {
      name: '建物モデル（新潟市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/15100_niigata/notexture/tileset.json',
    },
    {
      name: '建物モデル（新潟市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/15100_niigata/texture/tileset.json',
    },
    {
      name: '建物モデル（新潟市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/15100_niigata/low_resolution/tileset.json',
    },
    {
      name: '阿賀野川水系阿賀野川洪水浸水想定区域（新潟市）',
      type: '阿賀野川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/notexture/aganogawa_l1/tileset.json',
    },
    {
      name: '阿賀野川水系阿賀野川洪水浸水想定区域（新潟市）',
      type: '阿賀野川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/notexture/aganogawa_l2/tileset.json',
    },
    {
      name: '阿賀野川水系阿賀野川洪水浸水想定区域（新潟市）',
      type: '阿賀野川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture/aganogawa_l1/tileset.json',
    },
    {
      name: '阿賀野川水系阿賀野川洪水浸水想定区域（新潟市）',
      type: '阿賀野川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture/aganogawa_l2/tileset.json',
    },
    {
      name: '阿賀野川水系早出川洪水浸水想定区域（直轄管理区間）（新潟市）',
      type: '早出川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/notexture/hayadegawa_n_l1/tileset.json',
    },
    {
      name: '阿賀野川水系早出川洪水浸水想定区域（直轄管理区間）（新潟市）',
      type: '早出川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/notexture/hayadegawa_n_l2/tileset.json',
    },
    {
      name: '阿賀野川水系早出川洪水浸水想定区域（直轄管理区間）（新潟市）',
      type: '早出川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture/hayadegawa_n_l1/tileset.json',
    },
    {
      name: '阿賀野川水系早出川洪水浸水想定区域（直轄管理区間）（新潟市）',
      type: '早出川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture/hayadegawa_n_l2/tileset.json',
    },
    {
      name: '信濃川水系信濃川、大河津分水路洪水浸水想定区域（新潟市）',
      type: '信濃川河川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/notexture/shinanogawa_a_l1/tileset.json',
    },
    {
      name: '信濃川水系信濃川、大河津分水路洪水浸水想定区域（新潟市）',
      type: '信濃川河川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/notexture/shinanogawa_a_l2/tileset.json',
    },
    {
      name: '信濃川水系信濃川、大河津分水路洪水浸水想定区域（新潟市）',
      type: '信濃川河川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture/shinanogawa_a_l1/tileset.json',
    },
    {
      name: '信濃川水系信濃川、大河津分水路洪水浸水想定区域（新潟市）',
      type: '信濃川河川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture/shinanogawa_a_l2/tileset.json',
    },
    {
      name: '信濃川水系信濃川（下流）、関屋分水路洪水浸水想定区域（新潟市）',
      type: '信濃川下流L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/notexture/shinanogawa_b_l1/tileset.json',
    },
    {
      name: '信濃川水系信濃川（下流）、関屋分水路洪水浸水想定区域（新潟市）',
      type: '信濃川下流L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/notexture/shinanogawa_b_l2/tileset.json',
    },
    {
      name: '信濃川水系信濃川（下流）、関屋分水路洪水浸水想定区域（新潟市）',
      type: '信濃川下流L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture/shinanogawa_b_l1/tileset.json',
    },
    {
      name: '信濃川水系信濃川（下流）、関屋分水路洪水浸水想定区域（新潟市）',
      type: '信濃川下流L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture/shinanogawa_b_l2/tileset.json',
    },
    {
      name: '阿賀野川水系安野川洪水浸水想定区域（新潟市）',
      type: '安野川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/annogawa_l1/tileset.json',
    },
    {
      name: '阿賀野川水系安野川洪水浸水想定区域（新潟市）',
      type: '安野川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/annogawa_l2/tileset.json',
    },
    {
      name: '阿賀野川水系安野川洪水浸水想定区域（新潟市）',
      type: '安野川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/annogawa_l1/tileset.json',
    },
    {
      name: '阿賀野川水系安野川洪水浸水想定区域（新潟市）',
      type: '安野川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/annogawa_l2/tileset.json',
    },
    {
      name: '阿賀野川水系早出川洪水浸水想定区域（県管理区間）（新潟市）',
      type: '早出川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/hayadegawa_l1/tileset.json',
    },
    {
      name: '阿賀野川水系早出川洪水浸水想定区域（県管理区間）（新潟市）',
      type: '早出川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/hayadegawa_l2/tileset.json',
    },
    {
      name: '阿賀野川水系早出川洪水浸水想定区域（県管理区間）（新潟市）',
      type: '早出川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/hayadegawa_l1/tileset.json',
    },
    {
      name: '阿賀野川水系早出川洪水浸水想定区域（県管理区間）（新潟市）',
      type: '早出川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/hayadegawa_l2/tileset.json',
    },
    {
      name: '信濃川水系小阿賀野川・能代川・荻曽根川・滝谷川洪水浸水想定区域（新潟市）',
      type: '小阿賀野川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/koaganogawa_etc_l1/tileset.json',
    },
    {
      name: '信濃川水系小阿賀野川・能代川・荻曽根川・滝谷川洪水浸水想定区域（新潟市）',
      type: '小阿賀野川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/koaganogawa_etc_l2/tileset.json',
    },
    {
      name: '信濃川水系小阿賀野川・能代川・荻曽根川・滝谷川洪水浸水想定区域（新潟市）',
      type: '小阿賀野川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/koaganogawa_etc_l1/tileset.json',
    },
    {
      name: '信濃川水系小阿賀野川・能代川・荻曽根川・滝谷川洪水浸水想定区域（新潟市）',
      type: '小阿賀野川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/koaganogawa_etc_l2/tileset.json',
    },
    {
      name: '信濃川水系東大通川洪水浸水想定区域（新潟市）',
      type: '東大通川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/higashiodorigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系東大通川洪水浸水想定区域（新潟市）',
      type: '東大通川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/higashiodorigawa_l2/tileset.json',
    },
    {
      name: '信濃川水系東大通川洪水浸水想定区域（新潟市）',
      type: '東大通川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/higashiodorigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系東大通川洪水浸水想定区域（新潟市）',
      type: '東大通川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/higashiodorigawa_l2/tileset.json',
    },
    {
      name: '信濃川水系中ノ口川洪水浸水想定区域（新潟市）',
      type: '中ノ口川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/nakanokuchigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系中ノ口川洪水浸水想定区域（新潟市）',
      type: '中ノ口川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/nakanokuchigawa_l2/tileset.json',
    },
    {
      name: '信濃川水系中ノ口川洪水浸水想定区域（新潟市）',
      type: '中ノ口川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/nakanokuchigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系中ノ口川洪水浸水想定区域（新潟市）',
      type: '中ノ口川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/nakanokuchigawa_l2/tileset.json',
    },
    {
      name: '加治川水系加治川洪水浸水想定区域（新潟市）',
      type: '加治川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/kajikawa_l1/tileset.json',
    },
    {
      name: '加治川水系加治川洪水浸水想定区域（新潟市）',
      type: '加治川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/pref/kajikawa_l2/tileset.json',
    },
    {
      name: '加治川水系加治川洪水浸水想定区域（新潟市）',
      type: '加治川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/kajikawa_l1/tileset.json',
    },
    {
      name: '加治川水系加治川洪水浸水想定区域（新潟市）',
      type: '加治川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/15100_niigata/texture_pref/kajikawa_l2/tileset.json',
    },
    {
      name: '新潟県津波浸水想定図 （新潟市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/15100_niigata/notexture/tileset.json',
    },
    {
      name: '新潟県津波浸水想定図 （新潟市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/15100_niigata/texture/tileset.json',
    },
    {
      name: '建物モデル（金沢市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/17201_kanazawa/notexture/tileset.json',
    },
    {
      name: '手取川水系手取川洪水浸水想定区域（金沢市）',
      type: '手取川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/notexture/tedorigawa_l2/tileset.json',
    },
    {
      name: '手取川水系手取川洪水浸水想定区域（金沢市）',
      type: '手取川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture/tedorigawa_l2/tileset.json',
    },
    {
      name: '犀川水系犀川洪水浸水想定区域（金沢市）',
      type: '犀川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/saigawa_l1/tileset.json',
    },
    {
      name: '犀川水系犀川洪水浸水想定区域（金沢市）',
      type: '犀川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/saigawa_l2/tileset.json',
    },
    {
      name: '犀川水系犀川洪水浸水想定区域（金沢市）',
      type: '犀川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/saigawa_l1/tileset.json',
    },
    {
      name: '犀川水系犀川洪水浸水想定区域（金沢市）',
      type: '犀川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/saigawa_l2/tileset.json',
    },
    {
      name: '犀川水系伏見川洪水浸水想定区域（金沢市）',
      type: '伏見川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/fushimigawa_l1/tileset.json',
    },
    {
      name: '犀川水系伏見川洪水浸水想定区域（金沢市）',
      type: '伏見川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/fushimigawa_l2/tileset.json',
    },
    {
      name: '犀川水系伏見川洪水浸水想定区域（金沢市）',
      type: '伏見川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/fushimigawa_l1/tileset.json',
    },
    {
      name: '犀川水系伏見川洪水浸水想定区域（金沢市）',
      type: '伏見川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/fushimigawa_l2/tileset.json',
    },
    {
      name: '犀川水系高橋川洪水浸水想定区域（金沢市）',
      type: '高橋川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/takahashigawa_l2/tileset.json',
    },
    {
      name: '犀川水系高橋川洪水浸水想定区域（金沢市）',
      type: '高橋川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/takahashigawa_l2/tileset.json',
    },
    {
      name: '犀川水系安原川洪水浸水想定区域（金沢市）',
      type: '安原川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/yasuharagawa_l1/tileset.json',
    },
    {
      name: '犀川水系安原川洪水浸水想定区域（金沢市）',
      type: '安原川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/yasuharagawa_l2/tileset.json',
    },
    {
      name: '犀川水系安原川洪水浸水想定区域（金沢市）',
      type: '安原川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/yasuharagawa_l1/tileset.json',
    },
    {
      name: '犀川水系安原川洪水浸水想定区域（金沢市）',
      type: '安原川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/yasuharagawa_l2/tileset.json',
    },
    {
      name: '大野川水系浅野川洪水浸水想定区域（金沢市）',
      type: '浅野川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/asanogawa_l1/tileset.json',
    },
    {
      name: '大野川水系浅野川洪水浸水想定区域（金沢市）',
      type: '浅野川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/asanogawa_l2/tileset.json',
    },
    {
      name: '大野川水系浅野川洪水浸水想定区域（金沢市）',
      type: '浅野川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/asanogawa_l1/tileset.json',
    },
    {
      name: '大野川水系浅野川洪水浸水想定区域（金沢市）',
      type: '浅野川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/asanogawa_l2/tileset.json',
    },
    {
      name: '大野川水系大野川洪水浸水想定区域（金沢市）',
      type: '大野川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/onogawa_l1/tileset.json',
    },
    {
      name: '大野川水系大野川洪水浸水想定区域（金沢市）',
      type: '大野川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/onogawa_l2/tileset.json',
    },
    {
      name: '大野川水系大野川洪水浸水想定区域（金沢市）',
      type: '大野川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/onogawa_l1/tileset.json',
    },
    {
      name: '大野川水系大野川洪水浸水想定区域（金沢市）',
      type: '大野川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/onogawa_l2/tileset.json',
    },
    {
      name: '大野川水系河北潟洪水浸水想定区域（金沢市）',
      type: '河北潟L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/kahokugata_l1/tileset.json',
    },
    {
      name: '大野川水系河北潟洪水浸水想定区域（金沢市）',
      type: '河北潟L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/kahokugata_l2/tileset.json',
    },
    {
      name: '大野川水系河北潟洪水浸水想定区域（金沢市）',
      type: '河北潟L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/kahokugata_l1/tileset.json',
    },
    {
      name: '大野川水系河北潟洪水浸水想定区域（金沢市）',
      type: '河北潟L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/kahokugata_l2/tileset.json',
    },
    {
      name: '大野川水系金腐川洪水浸水想定区域（金沢市）',
      type: '金腐川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/kanakusarigawa_l1/tileset.json',
    },
    {
      name: '大野川水系金腐川洪水浸水想定区域（金沢市）',
      type: '金腐川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/kanakusarigawa_l2/tileset.json',
    },
    {
      name: '大野川水系金腐川洪水浸水想定区域（金沢市）',
      type: '金腐川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/kanakusarigawa_l1/tileset.json',
    },
    {
      name: '大野川水系金腐川洪水浸水想定区域（金沢市）',
      type: '金腐川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/kanakusarigawa_l2/tileset.json',
    },
    {
      name: '大野川水系森下川洪水浸水想定区域（金沢市）',
      type: '森下川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/morimotogawa_l1/tileset.json',
    },
    {
      name: '大野川水系森下川洪水浸水想定区域（金沢市）',
      type: '森下川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/morimotogawa_l2/tileset.json',
    },
    {
      name: '大野川水系森下川洪水浸水想定区域（金沢市）',
      type: '森下川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/morimotogawa_l1/tileset.json',
    },
    {
      name: '大野川水系森下川洪水浸水想定区域（金沢市）',
      type: '森下川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/morimotogawa_l2/tileset.json',
    },
    {
      name: '大野川水系津幡川洪水浸水想定区域（金沢市）',
      type: '津幡川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/tsubatagawa_l1/tileset.json',
    },
    {
      name: '大野川水系津幡川洪水浸水想定区域（金沢市）',
      type: '津幡川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/tsubatagawa_l2/tileset.json',
    },
    {
      name: '大野川水系津幡川洪水浸水想定区域（金沢市）',
      type: '津幡川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/tsubatagawa_l1/tileset.json',
    },
    {
      name: '大野川水系津幡川洪水浸水想定区域（金沢市）',
      type: '津幡川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/tsubatagawa_l2/tileset.json',
    },
    {
      name: '大野川水系宇ノ気川洪水浸水想定区域（金沢市）',
      type: '宇ノ気川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/unokegawa_l1/tileset.json',
    },
    {
      name: '大野川水系宇ノ気川洪水浸水想定区域（金沢市）',
      type: '宇ノ気川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/pref/unokegawa_l2/tileset.json',
    },
    {
      name: '大野川水系宇ノ気川洪水浸水想定区域（金沢市）',
      type: '宇ノ気川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/unokegawa_l1/tileset.json',
    },
    {
      name: '大野川水系宇ノ気川洪水浸水想定区域（金沢市）',
      type: '宇ノ気川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17201_kanazawa/texture_pref/unokegawa_l2/tileset.json',
    },
    {
      name: '新堀川水系新堀川・動橋川洪水浸水想定区域（加賀市）',
      type: '新堀川・動橋川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17206_kaga/pref/shinborigawa_etc_l1/tileset.json',
    },
    {
      name: '新堀川水系新堀川・動橋川洪水浸水想定区域（加賀市）',
      type: '新堀川・動橋川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17206_kaga/pref/shinborigawa_etc_l2/tileset.json',
    },
    {
      name: '新堀川水系新堀川・動橋川洪水浸水想定区域（加賀市）',
      type: '新堀川・動橋川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17206_kaga/texture_pref/shinborigawa_etc_l1/tileset.json',
    },
    {
      name: '新堀川水系新堀川・動橋川洪水浸水想定区域（加賀市）',
      type: '新堀川・動橋川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17206_kaga/texture_pref/shinborigawa_etc_l2/tileset.json',
    },
    {
      name: '大聖寺川水系大聖寺川洪水浸水想定区域（加賀市）',
      type: '大聖寺川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17206_kaga/pref/daishoujigawa_l1/tileset.json',
    },
    {
      name: '大聖寺川水系大聖寺川洪水浸水想定区域（加賀市）',
      type: '大聖寺川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17206_kaga/pref/daishoujigawa_l2/tileset.json',
    },
    {
      name: '大聖寺川水系大聖寺川洪水浸水想定区域（加賀市）',
      type: '大聖寺川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17206_kaga/texture_pref/daishoujigawa_l1/tileset.json',
    },
    {
      name: '大聖寺川水系大聖寺川洪水浸水想定区域（加賀市）',
      type: '大聖寺川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/17206_kaga/texture_pref/daishoujigawa_l2/tileset.json',
    },
    {
      name: '石川県津波浸水想定区域（金沢市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/17201_kanazawa/notexture/tileset.json',
    },
    {
      name: '石川県津波浸水想定区域（金沢市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/17201_kanazawa/texture/tileset.json',
    },
    {
      name: '石川県津波浸水想定区域（加賀市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/17206_kaga/notexture/tileset.json',
    },
    {
      name: '石川県津波浸水想定区域（加賀市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/17206_kaga/texture/tileset.json',
    },
    {
      name: '建物モデル（松本市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/20202_matsumoto/notexture/tileset.json',
    },
    {
      name: '建物モデル（松本市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/20202_matsumoto/texture/tileset.json',
    },
    {
      name: '建物モデル（松本市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/20202_matsumoto/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（岡谷市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/20204_okaya/notexture/tileset.json',
    },
    {
      name: '建物モデル（岡谷市）',
      type: 'テクスチャ付き（屋根のみ）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/20204_okaya/texture/tileset.json',
    },
    {
      name: '建物モデル（岡谷市）',
      type: 'テクスチャ付き（屋根のみ・低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/20204_okaya/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（伊那市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/20209_ina/notexture/tileset.json',
    },
    {
      name: '建物モデル（伊那市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/20209_ina/texture/tileset.json',
    },
    {
      name: '建物モデル（伊那市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/20209_ina/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（茅野市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/20214_chino/notexture/tileset.json',
    },
    {
      name: '信濃川水系犀川洪水浸水想定区域（松本市）',
      type: '犀川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/notexture/saigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系犀川洪水浸水想定区域（松本市）',
      type: '犀川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/notexture/saigawa_l2/tileset.json',
    },
    {
      name: '信濃川水系犀川洪水浸水想定区域（松本市）',
      type: '犀川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture/saigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系犀川洪水浸水想定区域（松本市）',
      type: '犀川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture/saigawa_l2/tileset.json',
    },
    {
      name: '信濃川水系鎖川洪水浸水想定区域（松本市）',
      type: '鎖川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/kusarigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系鎖川洪水浸水想定区域（松本市）',
      type: '鎖川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/kusarigawa_l2/tileset.json',
    },
    {
      name: '信濃川水系鎖川洪水浸水想定区域（松本市）',
      type: '鎖川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/kusarigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系鎖川洪水浸水想定区域（松本市）',
      type: '鎖川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/kusarigawa_l2/tileset.json',
    },
    {
      name: '信濃川水系小曽部川洪水浸水想定区域（松本市）',
      type: '小曽部川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/kosobegawa_l1/tileset.json',
    },
    {
      name: '信濃川水系小曽部川洪水浸水想定区域（松本市）',
      type: '小曽部川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/kosobegawa_l2/tileset.json',
    },
    {
      name: '信濃川水系小曽部川洪水浸水想定区域（松本市）',
      type: '小曽部川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/kosobegawa_l1/tileset.json',
    },
    {
      name: '信濃川水系小曽部川洪水浸水想定区域（松本市）',
      type: '小曽部川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/kosobegawa_l2/tileset.json',
    },
    {
      name: '信濃川水系奈良井川洪水浸水想定区域（松本市）',
      type: '奈良井川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/naraigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系奈良井川洪水浸水想定区域（松本市）',
      type: '奈良井川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/naraigawa_l2/tileset.json',
    },
    {
      name: '信濃川水系奈良井川洪水浸水想定区域（松本市）',
      type: '奈良井川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/naraigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系奈良井川洪水浸水想定区域（松本市）',
      type: '奈良井川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/naraigawa_l2/tileset.json',
    },
    {
      name: '信濃川水系田川洪水浸水想定区域（松本市）',
      type: '田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/tagawa_l1/tileset.json',
    },
    {
      name: '信濃川水系田川洪水浸水想定区域（松本市）',
      type: '田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/tagawa_l2/tileset.json',
    },
    {
      name: '信濃川水系田川洪水浸水想定区域（松本市）',
      type: '田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/tagawa_l1/tileset.json',
    },
    {
      name: '信濃川水系田川洪水浸水想定区域（松本市）',
      type: '田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/tagawa_l2/tileset.json',
    },
    {
      name: '信濃川水系牛伏川洪水浸水想定区域（松本市）',
      type: '牛伏川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/ushibusegawa_l1/tileset.json',
    },
    {
      name: '信濃川水系牛伏川洪水浸水想定区域（松本市）',
      type: '牛伏川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/ushibusegawa_l2/tileset.json',
    },
    {
      name: '信濃川水系牛伏川洪水浸水想定区域（松本市）',
      type: '牛伏川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/ushibusegawa_l1/tileset.json',
    },
    {
      name: '信濃川水系牛伏川洪水浸水想定区域（松本市）',
      type: '牛伏川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/ushibusegawa_l2/tileset.json',
    },
    {
      name: '信濃川水系三間沢川洪水浸水想定区域（松本市）',
      type: '三間沢川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/sankensawagawa_l1/tileset.json',
    },
    {
      name: '信濃川水系三間沢川洪水浸水想定区域（松本市）',
      type: '三間沢川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/sankensawagawa_l2/tileset.json',
    },
    {
      name: '信濃川水系三間沢川洪水浸水想定区域（松本市）',
      type: '三間沢川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/sankensawagawa_l1/tileset.json',
    },
    {
      name: '信濃川水系三間沢川洪水浸水想定区域（松本市）',
      type: '三間沢川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/sankensawagawa_l2/tileset.json',
    },
    {
      name: '信濃川水系薄川洪水浸水想定区域（松本市）',
      type: '薄川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/susukigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系薄川洪水浸水想定区域（松本市）',
      type: '薄川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/susukigawa_l2/tileset.json',
    },
    {
      name: '信濃川水系薄川洪水浸水想定区域（松本市）',
      type: '薄川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/susukigawa_l1/tileset.json',
    },
    {
      name: '信濃川水系薄川洪水浸水想定区域（松本市）',
      type: '薄川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/susukigawa_l2/tileset.json',
    },
    {
      name: '信濃川水系女鳥羽川洪水浸水想定区域（松本市）',
      type: '女鳥羽川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/metobagawa_l1/tileset.json',
    },
    {
      name: '信濃川水系女鳥羽川洪水浸水想定区域（松本市）',
      type: '女鳥羽川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/pref/metobagawa_l2/tileset.json',
    },
    {
      name: '信濃川水系女鳥羽川洪水浸水想定区域（松本市）',
      type: '女鳥羽川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/metobagawa_l1/tileset.json',
    },
    {
      name: '信濃川水系女鳥羽川洪水浸水想定区域（松本市）',
      type: '女鳥羽川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20202_matsumoto/texture_pref/metobagawa_l2/tileset.json',
    },
    {
      name: '天竜川水系横河川洪水浸水想定区域（岡谷市）',
      type: '横河川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/pref/yokokawagawa_l1/tileset.json',
    },
    {
      name: '天竜川水系横河川洪水浸水想定区域（岡谷市）',
      type: '横河川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/pref/yokokawagawa_l2/tileset.json',
    },
    {
      name: '天竜川水系横河川洪水浸水想定区域（岡谷市）',
      type: '横河川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/texture_pref/yokokawagawa_l1/tileset.json',
    },
    {
      name: '天竜川水系横河川洪水浸水想定区域（岡谷市）',
      type: '横河川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/texture_pref/yokokawagawa_l2/tileset.json',
    },
    {
      name: '天竜川水系諏訪湖洪水浸水想定区域（岡谷市）',
      type: '諏訪湖L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/pref/suwako_l1/tileset.json',
    },
    {
      name: '天竜川水系諏訪湖洪水浸水想定区域（岡谷市）',
      type: '諏訪湖L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/pref/suwako_l2/tileset.json',
    },
    {
      name: '天竜川水系諏訪湖洪水浸水想定区域（岡谷市）',
      type: '諏訪湖L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/texture_pref/suwako_l1/tileset.json',
    },
    {
      name: '天竜川水系諏訪湖洪水浸水想定区域（岡谷市）',
      type: '諏訪湖L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/texture_pref/suwako_l2/tileset.json',
    },
    {
      name: '天竜川水系上川・宮川洪水浸水想定区域（岡谷市）',
      type: '上川・宮川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/pref/kamigawa_etc_l1/tileset.json',
    },
    {
      name: '天竜川水系上川・宮川洪水浸水想定区域（岡谷市）',
      type: '上川・宮川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/pref/kamigawa_etc_l2/tileset.json',
    },
    {
      name: '天竜川水系上川・宮川洪水浸水想定区域（岡谷市）',
      type: '上川・宮川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/texture_pref/kamigawa_etc_l1/tileset.json',
    },
    {
      name: '天竜川水系上川・宮川洪水浸水想定区域（岡谷市）',
      type: '上川・宮川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/texture_pref/kamigawa_etc_l2/tileset.json',
    },
    {
      name: '天竜川水系砥川洪水浸水想定区域（岡谷市）',
      type: '砥川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/pref/togawa_l1/tileset.json',
    },
    {
      name: '天竜川水系砥川洪水浸水想定区域（岡谷市）',
      type: '砥川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/pref/togawa_l2/tileset.json',
    },
    {
      name: '天竜川水系砥川洪水浸水想定区域（岡谷市）',
      type: '砥川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/texture_pref/togawa_l1/tileset.json',
    },
    {
      name: '天竜川水系砥川洪水浸水想定区域（岡谷市）',
      type: '砥川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/texture_pref/togawa_l2/tileset.json',
    },
    {
      name: '天竜川水系天竜川洪水浸水想定区域（岡谷市）',
      type: '天竜川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/pref/tenryugawa_l1/tileset.json',
    },
    {
      name: '天竜川水系天竜川洪水浸水想定区域（岡谷市）',
      type: '天竜川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/pref/tenryugawa_l2/tileset.json',
    },
    {
      name: '天竜川水系天竜川洪水浸水想定区域（岡谷市）',
      type: '天竜川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/texture_pref/tenryugawa_l1/tileset.json',
    },
    {
      name: '天竜川水系天竜川洪水浸水想定区域（岡谷市）',
      type: '天竜川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20204_okaya/texture_pref/tenryugawa_l2/tileset.json',
    },
    {
      name: '天竜川水系天竜川洪水浸水想定区域（伊那市）',
      type: '天竜川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20209_ina/notexture/tenryugawa_l1/tileset.json',
    },
    {
      name: '天竜川水系天竜川洪水浸水想定区域（伊那市）',
      type: '天竜川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20209_ina/notexture/tenryugawa_l2/tileset.json',
    },
    {
      name: '天竜川水系天竜川洪水浸水想定区域（伊那市）',
      type: '天竜川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20209_ina/texture/tenryugawa_l1/tileset.json',
    },
    {
      name: '天竜川水系天竜川洪水浸水想定区域（伊那市）',
      type: '天竜川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20209_ina/texture/tenryugawa_l2/tileset.json',
    },
    {
      name: '天竜川水系上川・宮川洪水浸水想定区域（茅野市）',
      type: '上川・宮川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20214_chino/pref/kamigawa_etc_l1/tileset.json',
    },
    {
      name: '天竜川水系上川・宮川洪水浸水想定区域（茅野市）',
      type: '上川・宮川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20214_chino/pref/kamigawa_etc_l2/tileset.json',
    },
    {
      name: '天竜川水系上川・宮川洪水浸水想定区域（茅野市）',
      type: '上川・宮川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20214_chino/texture_pref/kamigawa_etc_l1/tileset.json',
    },
    {
      name: '天竜川水系上川・宮川洪水浸水想定区域（茅野市）',
      type: '上川・宮川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20214_chino/texture_pref/kamigawa_etc_l2/tileset.json',
    },
    {
      name: '上川・宮川浸水想定区域（茅野市）',
      type: '上川・宮川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20214_chino/pref/kamigawa_etc_l1/tileset.json',
    },
    {
      name: '上川・宮川浸水想定区域（茅野市）',
      type: '上川・宮川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20214_chino/pref/kamigawa_etc_l2/tileset.json',
    },
    {
      name: '上川・宮川浸水想定区域（茅野市）',
      type: '上川・宮川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20214_chino/texture_pref/kamigawa_etc_l1/tileset.json',
    },
    {
      name: '上川・宮川浸水想定区域（茅野市）',
      type: '上川・宮川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/20214_chino/texture_pref/kamigawa_etc_l2/tileset.json',
    },
    {
      name: 'ユースケース用建物モデル',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/20214_chino/texture/tileset.json',
    },
    {
      name: '建物モデル（岐阜市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/21201_gifu/notexture/tileset.json',
    },
    {
      name: '木曽川水系木曽川洪水浸水想定区域（岐阜市）',
      type: '木曽川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/notexture/kisogawa_l1/tileset.json',
    },
    {
      name: '木曽川水系木曽川洪水浸水想定区域（岐阜市）',
      type: '木曽川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/notexture/kisogawa_l2/tileset.json',
    },
    {
      name: '木曽川水系木曽川洪水浸水想定区域（岐阜市）',
      type: '木曽川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/texture/kisogawa_l1/tileset.json',
    },
    {
      name: '木曽川水系木曽川洪水浸水想定区域（岐阜市）',
      type: '木曽川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/texture/kisogawa_l2/tileset.json',
    },
    {
      name: '木曽川水系長良川洪水浸水想定区域（岐阜市）',
      type: '長良川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/notexture/nagaragawa_l1/tileset.json',
    },
    {
      name: '木曽川水系長良川洪水浸水想定区域（岐阜市）',
      type: '長良川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/notexture/nagaragawa_l2/tileset.json',
    },
    {
      name: '木曽川水系長良川洪水浸水想定区域（岐阜市）',
      type: '長良川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/texture/nagaragawa_l1/tileset.json',
    },
    {
      name: '木曽川水系長良川洪水浸水想定区域（岐阜市）',
      type: '長良川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/texture/nagaragawa_l2/tileset.json',
    },
    {
      name: '木曽川水系揖斐川洪水浸水想定区域（岐阜市）',
      type: '揖斐川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/notexture/ibigawa_l2/tileset.json',
    },
    {
      name: '木曽川水系揖斐川洪水浸水想定区域（岐阜市）',
      type: '揖斐川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/texture/ibigawa_l2/tileset.json',
    },
    {
      name: '木曽川水系伊自良川洪水浸水想定区域（岐阜市）',
      type: '伊自良川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/notexture/ijiragawa_l1/tileset.json',
    },
    {
      name: '木曽川水系伊自良川洪水浸水想定区域（岐阜市）',
      type: '伊自良川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/notexture/ijiragawa_l2/tileset.json',
    },
    {
      name: '木曽川水系伊自良川洪水浸水想定区域（岐阜市）',
      type: '伊自良川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/texture/ijiragawa_l1/tileset.json',
    },
    {
      name: '木曽川水系伊自良川洪水浸水想定区域（岐阜市）',
      type: '伊自良川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/texture/ijiragawa_l2/tileset.json',
    },
    {
      name: '木曽川水系根尾川洪水浸水想定区域（岐阜市）',
      type: '根尾川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/notexture/neogawa_l2/tileset.json',
    },
    {
      name: '木曽川水系根尾川洪水浸水想定区域（岐阜市）',
      type: '根尾川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/texture/neogawa_l2/tileset.json',
    },
    {
      name: '建物モデル（沼津市）',
      type: 'LOD3: テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/22203_numazu_2021/lod3/notexture/tileset.json',
    },
    {
      name: '建物モデル（沼津市）',
      type: 'LOD3: テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/22203_numazu_2021/lod3/texture/tileset.json',
    },
    {
      name: '建物モデル（沼津市）',
      type: 'LOD3: テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/22203_numazu_2021/lod3/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（沼津市）',
      type: 'LOD2: テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/22203_numazu_2021/lod2/notexture/tileset.json',
    },
    {
      name: '建物モデル（沼津市）',
      type: 'LOD2: テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/22203_numazu_2021/lod2/texture/tileset.json',
    },
    {
      name: '建物モデル（沼津市）',
      type: 'LOD2: テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/22203_numazu_2021/lod2/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（掛川市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/22213_kakegawa/notexture/tileset.json',
    },
    {
      name: '建物モデル（掛川市）',
      type: 'テクスチャ付き（屋根のみ）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/22213_kakegawa/texture/tileset.json',
    },
    {
      name: '建物モデル（掛川市）',
      type: 'テクスチャ付き（屋根のみ・低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/22213_kakegawa/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（菊川市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/22224_kikugawa/notexture/tileset.json',
    },
    {
      name: '道路モデルLOD3（沼津市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tran/22203_numazu/trafficarea/tileset.json',
    },
    {
      name: '都市設備モデル（沼津市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/frn/22203_numazu/notexture/tileset.json',
    },
    {
      name: '都市設備モデル（沼津市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/frn/22203_numazu/texture/tileset.json',
    },
    {
      name: '植生モデル（沼津市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/veg/22203_numazu/tileset.json',
    },
    {
      name: '狩野川水系狩野川洪水浸水想定区域（沼津市）',
      type: '狩野川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/notexture/kanogawa_l1/tileset.json',
    },
    {
      name: '狩野川水系狩野川洪水浸水想定区域（沼津市）',
      type: '狩野川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/notexture/kanogawa_l2/tileset.json',
    },
    {
      name: '狩野川水系狩野川洪水浸水想定区域（沼津市）',
      type: '狩野川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/texture/kanogawa_l1/tileset.json',
    },
    {
      name: '狩野川水系狩野川洪水浸水想定区域（沼津市）',
      type: '狩野川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/texture/kanogawa_l2/tileset.json',
    },
    {
      name: '狩野川水系黄瀬川洪水浸水想定区域（沼津市）',
      type: '黄瀬川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/notexture/kisegawa_l1/tileset.json',
    },
    {
      name: '狩野川水系黄瀬川洪水浸水想定区域（沼津市）',
      type: '黄瀬川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/notexture/kisegawa_l2/tileset.json',
    },
    {
      name: '狩野川水系黄瀬川洪水浸水想定区域（沼津市）',
      type: '黄瀬川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/texture/kisegawa_l1/tileset.json',
    },
    {
      name: '狩野川水系黄瀬川洪水浸水想定区域（沼津市）',
      type: '黄瀬川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/texture/kisegawa_l2/tileset.json',
    },
    {
      name: '狩野川水系大場川洪水浸水想定区域（沼津市）',
      type: '大場川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/notexture/oobagawa_l1/tileset.json',
    },
    {
      name: '狩野川水系大場川洪水浸水想定区域（沼津市）',
      type: '大場川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/notexture/oobagawa_l2/tileset.json',
    },
    {
      name: '狩野川水系大場川洪水浸水想定区域（沼津市）',
      type: '大場川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/texture/oobagawa_l1/tileset.json',
    },
    {
      name: '狩野川水系大場川洪水浸水想定区域（沼津市）',
      type: '大場川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22203_numazu/texture/oobagawa_l2/tileset.json',
    },
    {
      name: '菊川水系菊川・牛淵川・下小笠川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/notexture/kikugawa_l1/tileset.json',
    },
    {
      name: '菊川水系菊川・牛淵川・下小笠川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/notexture/kikugawa_l2/tileset.json',
    },
    {
      name: '菊川水系菊川・牛淵川・下小笠川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture/kikugawa_l1/tileset.json',
    },
    {
      name: '菊川水系菊川・牛淵川・下小笠川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture/kikugawa_l2/tileset.json',
    },
    {
      name: '太田川水系太田川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/pref/ootagawa_l1/tileset.json',
    },
    {
      name: '太田川水系太田川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/pref/ootagawa_l2/tileset.json',
    },
    {
      name: '太田川水系太田川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture_pref/ootagawa_l1/tileset.json',
    },
    {
      name: '太田川水系太田川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture_pref/ootagawa_l2/tileset.json',
    },
    {
      name: '太田川水系原野谷川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/pref/haranoyagawa_l1/tileset.json',
    },
    {
      name: '太田川水系原野谷川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/pref/haranoyagawa_l2/tileset.json',
    },
    {
      name: '太田川水系原野谷川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture_pref/haranoyagawa_l1/tileset.json',
    },
    {
      name: '太田川水系原野谷川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture_pref/haranoyagawa_l2/tileset.json',
    },
    {
      name: '太田川水系逆川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/pref/sakagawa_l1/tileset.json',
    },
    {
      name: '太田川水系逆川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/pref/sakagawa_l2/tileset.json',
    },
    {
      name: '太田川水系逆川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture_pref/sakagawa_l1/tileset.json',
    },
    {
      name: '太田川水系逆川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture_pref/sakagawa_l2/tileset.json',
    },
    {
      name: '太田川水系太田川・原野谷川・敷地川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/pref/ootagawa_etc_a_l1/tileset.json',
    },
    {
      name: '太田川水系太田川・原野谷川・敷地川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/pref/ootagawa_etc_a_l2/tileset.json',
    },
    {
      name: '太田川水系太田川・原野谷川・敷地川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture_pref/ootagawa_etc_a_l1/tileset.json',
    },
    {
      name: '太田川水系太田川・原野谷川・敷地川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture_pref/ootagawa_etc_a_l2/tileset.json',
    },
    {
      name: '太田川水系太田川・原野谷川・敷地川・宇刈川・逆川・ぼう僧川・今ノ浦川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/pref/ootagawa_etc_b_l1/tileset.json',
    },
    {
      name: '太田川水系太田川・原野谷川・敷地川・宇刈川・逆川・ぼう僧川・今ノ浦川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/pref/ootagawa_etc_b_l2/tileset.json',
    },
    {
      name: '太田川水系太田川・原野谷川・敷地川・宇刈川・逆川・ぼう僧川・今ノ浦川洪水浸水想定区域（掛川市）',
      type: 'L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture_pref/ootagawa_etc_b_l1/tileset.json',
    },
    {
      name: '太田川水系太田川・原野谷川・敷地川・宇刈川・逆川・ぼう僧川・今ノ浦川洪水浸水想定区域（掛川市）',
      type: 'L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22213_kakegawa/texture_pref/ootagawa_etc_b_l2/tileset.json',
    },
    {
      name: '菊川水系菊川・牛淵川・下小笠川洪水浸水想定区域（菊川市）',
      type: '菊川・牛淵川・下小笠川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22224_kikugawa/notexture/kikugawa_l1/tileset.json',
    },
    {
      name: '菊川水系菊川・牛淵川・下小笠川洪水浸水想定区域（菊川市）',
      type: '菊川・牛淵川・下小笠川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22224_kikugawa/notexture/kikugawa_l2/tileset.json',
    },
    {
      name: '菊川水系菊川・牛淵川・下小笠川洪水浸水想定区域（菊川市）',
      type: '菊川・牛淵川・下小笠川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22224_kikugawa/texture/kikugawa_l1/tileset.json',
    },
    {
      name: '菊川水系菊川・牛淵川・下小笠川洪水浸水想定区域（菊川市）',
      type: '菊川・牛淵川・下小笠川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/22224_kikugawa/texture/kikugawa_l2/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（沼津市）',
      type: '水面表現なし:静岡県第４次地震被害想定津波浸水（レベル２津波の重ね合わせ図）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_1/22203_numazu/notexture/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（沼津市）',
      type: '水面表現あり:静岡県第４次地震被害想定津波浸水（レベル２津波の重ね合わせ図）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_1/22203_numazu/texture/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（沼津市）',
      type: '水面表現なし:静岡県第４次地震被害想定津波浸水（元禄型関東地震）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_2/22203_numazu/notexture/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（沼津市）',
      type: '水面表現あり:静岡県第４次地震被害想定津波浸水（元禄型関東地震）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_2/22203_numazu/texture/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（沼津市）',
      type: '水面表現なし:静岡県第４次地震被害想定津波浸水（南海トラフ巨大地震（ケース１））',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_3/22203_numazu/notexture/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（沼津市）',
      type: '水面表現あり:静岡県第４次地震被害想定津波浸水（南海トラフ巨大地震（ケース１））',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_3/22203_numazu/texture/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（沼津市）',
      type: '水面表現なし:静岡県第４次地震被害想定津波浸水（相模トラフ沿いの最大クラスの地震（ケース１））',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_4/22203_numazu/notexture/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（沼津市）',
      type: '水面表現あり:静岡県第４次地震被害想定津波浸水（相模トラフ沿いの最大クラスの地震（ケース１））',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_4/22203_numazu/texture/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（掛川市）',
      type: '水面表現なし:静岡県第4次地震被害想定1',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_1/22213_kakegawa/notexture/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（掛川市）',
      type: '水面表現あり:静岡県第4次地震被害想定1',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_1/22213_kakegawa/texture/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（掛川市）',
      type: '水面表現なし:静岡県第4次地震被害想定2',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_2/22213_kakegawa/notexture/tileset.json',
    },
    {
      name: '静岡県第４次地震被害想定津波浸水（掛川市）',
      type: '水面表現あり:静岡県第4次地震被害想定2',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami_2/22213_kakegawa/texture/tileset.json',
    },
    {
      name: '建物モデル（千種区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23101_chikusa-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（千種区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23101_chikusa-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（千種区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23101_chikusa-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（東区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23102_higashi-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（東区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23102_higashi-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（東区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23102_higashi-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（北区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23103_kita-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（北区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23103_kita-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（北区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23103_kita-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（西区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23104_nishi-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（西区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23104_nishi-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（西区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23104_nishi-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（中村区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23105_nakamura-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（中村区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23105_nakamura-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（中村区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23105_nakamura-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（中区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23106_naka-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（中区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23106_naka-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（中区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23106_naka-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（昭和区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23107_showa-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（昭和区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23107_showa-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（昭和区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23107_showa-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（瑞穂区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23108_mizuho-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（瑞穂区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23108_mizuho-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（瑞穂区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23108_mizuho-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（熱田区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23109_atsuta-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（熱田区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23109_atsuta-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（熱田区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23109_atsuta-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（中川区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23110_nakagawa-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（中川区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23110_nakagawa-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（中川区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23110_nakagawa-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（港区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23111_minato-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（港区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23111_minato-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（港区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23111_minato-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（南区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23112_minami-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（南区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23112_minami-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（南区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23112_minami-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（守山区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23113_moriyama-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（守山区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23113_moriyama-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（守山区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23113_moriyama-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（緑区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23114_midori-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（緑区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23114_midori-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（緑区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23114_midori-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（名東区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23115_meito-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（名東区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23115_meito-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（名東区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23115_meito-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（天白区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23116_tempaku-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（天白区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23116_tempaku-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（天白区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23100_nagoya/23116_tempaku-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（本庁地域）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_honcho/notexture/tileset.json',
    },
    {
      name: '建物モデル（本庁地域）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_honcho/texture/tileset.json',
    },
    {
      name: '建物モデル（本庁地域）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_honcho/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（岡崎地域）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_okazaki/notexture/tileset.json',
    },
    {
      name: '建物モデル（岡崎地域）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_okazaki/texture/tileset.json',
    },
    {
      name: '建物モデル（岡崎地域）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_okazaki/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（太平地域）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_ohira/notexture/tileset.json',
    },
    {
      name: '建物モデル（太平地域）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_ohira/texture/tileset.json',
    },
    {
      name: '建物モデル（太平地域）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_ohira/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（東部地域）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_tobu/notexture/tileset.json',
    },
    {
      name: '建物モデル（東部地域）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_tobu/texture/tileset.json',
    },
    {
      name: '建物モデル（東部地域）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_tobu/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（岩津地域）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_iwazu/notexture/tileset.json',
    },
    {
      name: '建物モデル（岩津地域）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_iwazu/texture/tileset.json',
    },
    {
      name: '建物モデル（岩津地域）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_iwazu/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（矢作地域）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_yahagi/notexture/tileset.json',
    },
    {
      name: '建物モデル（矢作地域）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_yahagi/texture/tileset.json',
    },
    {
      name: '建物モデル（矢作地域）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_yahagi/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（六ツ美地域）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_mutsumi/notexture/tileset.json',
    },
    {
      name: '建物モデル（六ツ美地域）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_mutsumi/texture/tileset.json',
    },
    {
      name: '建物モデル（六ツ美地域）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_mutsumi/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（額田地域）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_nukata/notexture/tileset.json',
    },
    {
      name: '建物モデル（額田地域）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_nukata/texture/tileset.json',
    },
    {
      name: '建物モデル（額田地域）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23202_okazaki/23202_nukata/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（津島市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23208_tsushima/notexture/tileset.json',
    },
    {
      name: '建物モデル（津島市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23208_tsushima/texture/tileset.json',
    },
    {
      name: '建物モデル（津島市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23208_tsushima/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（安城市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23212_anjo/notexture/tileset.json',
    },
    {
      name: '建物モデル（安城市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23212_anjo/texture/tileset.json',
    },
    {
      name: '建物モデル（安城市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/23212_anjo/low_resolution/tileset.json',
    },
    {
      name: '庄内川水系庄内川洪水浸水想定区域（名古屋市）',
      type: '庄内川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23100_nagoya/notexture/shonaigawa_l1/tileset.json',
    },
    {
      name: '庄内川水系庄内川洪水浸水想定区域（名古屋市）',
      type: '庄内川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23100_nagoya/notexture/shonaigawa_l2/tileset.json',
    },
    {
      name: '庄内川水系庄内川洪水浸水想定区域（名古屋市）',
      type: '庄内川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23100_nagoya/texture/shonaigawa_l1/tileset.json',
    },
    {
      name: '庄内川水系庄内川洪水浸水想定区域（名古屋市）',
      type: '庄内川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23100_nagoya/texture/shonaigawa_l2/tileset.json',
    },
    {
      name: '庄内川水系矢田川洪水浸水想定区域（名古屋市）',
      type: '矢田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23100_nagoya/notexture/yadagawa_l1/tileset.json',
    },
    {
      name: '庄内川水系矢田川洪水浸水想定区域（名古屋市）',
      type: '矢田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23100_nagoya/notexture/yadagawa_l2/tileset.json',
    },
    {
      name: '庄内川水系矢田川洪水浸水想定区域（名古屋市）',
      type: '矢田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23100_nagoya/texture/yadagawa_l1/tileset.json',
    },
    {
      name: '庄内川水系矢田川洪水浸水想定区域（名古屋市）',
      type: '矢田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23100_nagoya/texture/yadagawa_l2/tileset.json',
    },
    {
      name: '木曽川水系木曽川洪水浸水想定区域（名古屋市）',
      type: '木曽川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23100_nagoya/notexture/kisogawa_l2/tileset.json',
    },
    {
      name: '木曽川水系木曽川洪水浸水想定区域（名古屋市）',
      type: '木曽川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23100_nagoya/texture/kisogawa_l2/tileset.json',
    },
    {
      name: '矢作川水系矢作川洪水浸水想定区域（岡崎市）',
      type: '矢作川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/notexture/yahagigawa_l1/tileset.json',
    },
    {
      name: '矢作川水系矢作川洪水浸水想定区域（岡崎市）',
      type: '矢作川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/notexture/yahagigawa_l2/tileset.json',
    },
    {
      name: '矢作川水系矢作川洪水浸水想定区域（岡崎市）',
      type: '矢作川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/texture/yahagigawa_l1/tileset.json',
    },
    {
      name: '矢作川水系矢作川洪水浸水想定区域（岡崎市）',
      type: '矢作川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/texture/yahagigawa_l2/tileset.json',
    },
    {
      name: '矢作川水系乙川流域浸水予想図（岡崎市）',
      type: '乙川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/pref/otogawa_l1/tileset.json',
    },
    {
      name: '矢作川水系乙川流域浸水予想図（岡崎市）',
      type: '乙川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/pref/otogawa_l2/tileset.json',
    },
    {
      name: '矢作川水系乙川流域浸水予想図（岡崎市）',
      type: '乙川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/texture_pref/otogawa_l1/tileset.json',
    },
    {
      name: '矢作川水系乙川流域浸水予想図（岡崎市）',
      type: '乙川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/texture_pref/otogawa_l2/tileset.json',
    },
    {
      name: '矢作川水系広田川洪水浸水想定区域（岡崎市）',
      type: '広田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/pref/koudagawa_l1/tileset.json',
    },
    {
      name: '矢作川水系広田川洪水浸水想定区域（岡崎市）',
      type: '広田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/pref/koudagawa_l2/tileset.json',
    },
    {
      name: '矢作川水系広田川洪水浸水想定区域（岡崎市）',
      type: '広田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/texture_pref/koudagawa_l1/tileset.json',
    },
    {
      name: '矢作川水系広田川洪水浸水想定区域（岡崎市）',
      type: '広田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23202_okazaki/texture_pref/koudagawa_l2/tileset.json',
    },
    {
      name: '木曽川水系木曽川洪水浸水想定区域（津島市）',
      type: '木曽川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23208_tsushima/notexture/kisogawa_l1/tileset.json',
    },
    {
      name: '木曽川水系木曽川洪水浸水想定区域（津島市）',
      type: '木曽川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23208_tsushima/notexture/kisogawa_l2/tileset.json',
    },
    {
      name: '木曽川水系木曽川洪水浸水想定区域（津島市）',
      type: '木曽川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23208_tsushima/texture/kisogawa_l1/tileset.json',
    },
    {
      name: '木曽川水系木曽川洪水浸水想定区域（津島市）',
      type: '木曽川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/23208_tsushima/texture/kisogawa_l2/tileset.json',
    },
    {
      name: '木曽川浸水想定区域（安城市）',
      type: '木曽川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/notexture/kisogawa_l1/tileset.json',
    },
    {
      name: '木曽川浸水想定区域（安城市）',
      type: '木曽川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/notexture/kisogawa_l2/tileset.json',
    },
    {
      name: '木曽川浸水想定区域（安城市）',
      type: '木曽川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/texture/kisogawa_l1/tileset.json',
    },
    {
      name: '木曽川浸水想定区域（安城市）',
      type: '木曽川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/21201_gifu/texture/kisogawa_l2/tileset.json',
    },
    {
      name: '愛知県津波浸水想定区域（津島市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/23208_tsushima/notexture/tileset.json',
    },
    {
      name: '愛知県津波浸水想定区域（津島市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/23208_tsushima/texture/tileset.json',
    },
    {
      name: '建物モデル（都島区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27102_miyakojima-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（福島区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27103_fukushima-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（此花区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27104_konohana-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（西区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27106_nishi-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（港区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27107_minato-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（大正区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27108_taisho-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（天王寺区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27109_tennoji-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（浪速区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27111_naniwa-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（西淀川区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27113_nishiyodogawa-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（東淀川区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27114_higashiyodogawa-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（東淀川区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27114_higashiyodogawa-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（東淀川区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27114_higashiyodogawa-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（東成区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27115_higashinari-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（生野区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27116_ikuno-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（旭区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27117_asahi-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（城東区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27118_joto-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（阿倍野区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27119_abeno-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（住吉区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27120_sumiyoshi-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（東住吉区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27121_higashisumiyoshi-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（西成区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27122_nishinari-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（淀川区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27123_yodogawa-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（淀川区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27123_yodogawa-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（淀川区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27123_yodogawa-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（鶴見区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27124_tsurumi-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（住之江区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27125_suminoe-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（平野区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27126_hirano-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（北区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27127_kita-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（中央区）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27128_chuo-ku/notexture/tileset.json',
    },
    {
      name: '建物モデル（中央区）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27128_chuo-ku/texture/tileset.json',
    },
    {
      name: '建物モデル（中央区）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27100_osaka/27128_chuo-ku/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（豊中市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27203_toyonaka/notexture/tileset.json',
    },
    {
      name: '建物モデル（豊中市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27203_toyonaka/texture/tileset.json',
    },
    {
      name: '建物モデル（豊中市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27203_toyonaka/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（池田市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27204_ikeda/notexture/tileset.json',
    },
    {
      name: '建物モデル（池田市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27204_ikeda/texture/tileset.json',
    },
    {
      name: '建物モデル（池田市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27204_ikeda/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（高槻市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27207_takatsuki/notexture/tileset.json',
    },
    {
      name: '建物モデル（高槻市）',
      type: 'テクスチャ付き（屋根のみ）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27207_takatsuki/texture/tileset.json',
    },
    {
      name: '建物モデル（高槻市）',
      type: 'テクスチャ付き（屋根のみ・低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27207_takatsuki/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（摂津市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27224_settsu/notexture/tileset.json',
    },
    {
      name: '建物モデル（忠岡町）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/27341_tadaoka/notexture/tileset.json',
    },
    {
      name: '淀川水系猪名川・藻川洪水浸水想定区域（豊中市）',
      type: '猪名川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/notexture/inagawa_n_l1/tileset.json',
    },
    {
      name: '淀川水系猪名川・藻川洪水浸水想定区域（豊中市）',
      type: '猪名川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/notexture/inagawa_n_l2/tileset.json',
    },
    {
      name: '淀川水系猪名川・藻川洪水浸水想定区域（豊中市）',
      type: '猪名川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture/inagawa_n_l1/tileset.json',
    },
    {
      name: '淀川水系猪名川・藻川洪水浸水想定区域（豊中市）',
      type: '猪名川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture/inagawa_n_l2/tileset.json',
    },
    {
      name: '淀川水系淀川・宇治川・木津川・桂川洪水浸水想定区域（豊中市）',
      type: '淀川・宇治川・木津川・桂川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/notexture/yodogawa_l2/tileset.json',
    },
    {
      name: '淀川水系淀川・宇治川・木津川・桂川洪水浸水想定区域（豊中市）',
      type: '淀川・宇治川・木津川・桂川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture/yodogawa_l2/tileset.json',
    },
    {
      name: '淀川水系天竺川・兎川洪水浸水想定区域（豊中市）',
      type: '天竺川・兎川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/pref/tenjikugawa_etc_l1/tileset.json',
    },
    {
      name: '淀川水系天竺川・兎川洪水浸水想定区域（豊中市）',
      type: '天竺川・兎川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/pref/tenjikugawa_etc_l2/tileset.json',
    },
    {
      name: '淀川水系天竺川・兎川洪水浸水想定区域（豊中市）',
      type: '天竺川・兎川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture_pref/tenjikugawa_etc_l1/tileset.json',
    },
    {
      name: '淀川水系天竺川・兎川洪水浸水想定区域（豊中市）',
      type: '天竺川・兎川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture_pref/tenjikugawa_etc_l2/tileset.json',
    },
    {
      name: '淀川水系神崎川・中島川・左門殿川・西島川洪水浸水想定区域（豊中市）',
      type: '神崎川・中島川・左門殿川・西島川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/pref/kanzakigawa_etc_l1/tileset.json',
    },
    {
      name: '淀川水系神崎川・中島川・左門殿川・西島川洪水浸水想定区域（豊中市）',
      type: '神崎川・中島川・左門殿川・西島川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/pref/kanzakigawa_etc_l2/tileset.json',
    },
    {
      name: '淀川水系神崎川・中島川・左門殿川・西島川洪水浸水想定区域（豊中市）',
      type: '神崎川・中島川・左門殿川・西島川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture_pref/kanzakigawa_etc_l1/tileset.json',
    },
    {
      name: '淀川水系神崎川・中島川・左門殿川・西島川洪水浸水想定区域（豊中市）',
      type: '神崎川・中島川・左門殿川・西島川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture_pref/kanzakigawa_etc_l2/tileset.json',
    },
    {
      name: '淀川水系旧猪名川洪水浸水想定区域（豊中市）',
      type: '旧猪名川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/pref/kyu_inagawa_l2/tileset.json',
    },
    {
      name: '淀川水系旧猪名川洪水浸水想定区域（豊中市）',
      type: '旧猪名川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture_pref/kyu_inagawa_l2/tileset.json',
    },
    {
      name: '淀川水系高川洪水浸水想定区域（豊中市）',
      type: '高川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/pref/takagawa_l1/tileset.json',
    },
    {
      name: '淀川水系高川洪水浸水想定区域（豊中市）',
      type: '高川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/pref/takagawa_l2/tileset.json',
    },
    {
      name: '淀川水系高川洪水浸水想定区域（豊中市）',
      type: '高川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture_pref/takagawa_l1/tileset.json',
    },
    {
      name: '淀川水系高川洪水浸水想定区域（豊中市）',
      type: '高川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture_pref/takagawa_l2/tileset.json',
    },
    {
      name: '淀川水系千里川・芋川・箕面鍋田川洪水浸水想定区域（豊中市）',
      type: '千里川・芋川・箕面鍋田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/pref/senrigawa_l2/tileset.json',
    },
    {
      name: '淀川水系千里川・芋川・箕面鍋田川洪水浸水想定区域（豊中市）',
      type: '千里川・芋川・箕面鍋田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture_pref/senrigawa_l2/tileset.json',
    },
    {
      name: '淀川水系箕面川・茶長阪川・石澄川洪水浸水想定区域（豊中市）',
      type: '箕面川・茶長阪川・石澄川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/pref/minoogawa_l2/tileset.json',
    },
    {
      name: '淀川水系箕面川・茶長阪川・石澄川洪水浸水想定区域（豊中市）',
      type: '箕面川・茶長阪川・石澄川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27203_toyonaka/texture_pref/minoogawa_l2/tileset.json',
    },
    {
      name: '淀川水系猪名川・藻川洪水浸水想定区域（池田市）',
      type: '猪名川・藻川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/notexture/inagawa_n_l1/tileset.json',
    },
    {
      name: '淀川水系猪名川・藻川洪水浸水想定区域（池田市）',
      type: '猪名川・藻川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/notexture/inagawa_n_l2/tileset.json',
    },
    {
      name: '淀川水系猪名川・藻川洪水浸水想定区域（池田市）',
      type: '猪名川・藻川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/texture/inagawa_n_l1/tileset.json',
    },
    {
      name: '淀川水系猪名川・藻川洪水浸水想定区域（池田市）',
      type: '猪名川・藻川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/texture/inagawa_n_l2/tileset.json',
    },
    {
      name: '淀川水系猪名川洪水浸水想定区域（池田市）',
      type: '猪名川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/pref/inagawa_l2/tileset.json',
    },
    {
      name: '淀川水系猪名川洪水浸水想定区域（池田市）',
      type: '猪名川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/texture_pref/inagawa_l2/tileset.json',
    },
    {
      name: '淀川水系箕面川・茶長阪川・石澄川洪水浸水想定区域（池田市）',
      type: '箕面川・茶長阪川・石澄川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/pref/minoogawa_l1/tileset.json',
    },
    {
      name: '淀川水系箕面川・茶長阪川・石澄川洪水浸水想定区域（池田市）',
      type: '箕面川・茶長阪川・石澄川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/pref/minoogawa_l2/tileset.json',
    },
    {
      name: '淀川水系箕面川・茶長阪川・石澄川洪水浸水想定区域（池田市）',
      type: '箕面川・茶長阪川・石澄川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/texture_pref/minoogawa_l1/tileset.json',
    },
    {
      name: '淀川水系箕面川・茶長阪川・石澄川洪水浸水想定区域（池田市）',
      type: '箕面川・茶長阪川・石澄川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/texture_pref/minoogawa_l2/tileset.json',
    },
    {
      name: '淀川水系余野川・石田川・切畑川・木代川洪水浸水想定区域（池田市）',
      type: '余野川・石田川・切畑川・木代川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/pref/yonogawa_l1/tileset.json',
    },
    {
      name: '淀川水系余野川・石田川・切畑川・木代川洪水浸水想定区域（池田市）',
      type: '余野川・石田川・切畑川・木代川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/pref/yonogawa_l2/tileset.json',
    },
    {
      name: '淀川水系余野川・石田川・切畑川・木代川洪水浸水想定区域（池田市）',
      type: '余野川・石田川・切畑川・木代川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/texture_pref/yonogawa_l1/tileset.json',
    },
    {
      name: '淀川水系余野川・石田川・切畑川・木代川洪水浸水想定区域（池田市）',
      type: '余野川・石田川・切畑川・木代川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27204_ikeda/texture_pref/yonogawa_l2/tileset.json',
    },
    {
      name: '淀川水系淀川・宇治川・木津川・桂川洪水浸水想定区域（高槻市）',
      type: '淀川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/notexture/yodogawa_l2/tileset.json',
    },
    {
      name: '淀川水系淀川・宇治川・木津川・桂川洪水浸水想定区域（高槻市）',
      type: '淀川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture/yodogawa_l2/tileset.json',
    },
    {
      name: '淀川水系神崎川・中嶋川・左門殿川・西島川洪水浸水想定区域（高槻市）',
      type: '神崎川・中嶋川・左門殿川・西島川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/kanzakigawa_etc_l2/tileset.json',
    },
    {
      name: '淀川水系神崎川・中嶋川・左門殿川・西島川洪水浸水想定区域（高槻市）',
      type: '神崎川・中嶋川・左門殿川・西島川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/kanzakigawa_etc_l2/tileset.json',
    },
    {
      name: '淀川水系安威川洪水浸水想定区域（高槻市）',
      type: '安威川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/aigawa_l1/tileset.json',
    },
    {
      name: '淀川水系安威川洪水浸水想定区域（高槻市）',
      type: '安威川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/aigawa_l2/tileset.json',
    },
    {
      name: '淀川水系安威川洪水浸水想定区域（高槻市）',
      type: '安威川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/aigawa_l1/tileset.json',
    },
    {
      name: '淀川水系安威川洪水浸水想定区域（高槻市）',
      type: '安威川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/aigawa_l2/tileset.json',
    },
    {
      name: '淀川水系芥川洪水浸水想定区域（高槻市）',
      type: '芥川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/akutagawa_l1/tileset.json',
    },
    {
      name: '淀川水系芥川洪水浸水想定区域（高槻市）',
      type: '芥川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/akutagawa_l2/tileset.json',
    },
    {
      name: '淀川水系芥川洪水浸水想定区域（高槻市）',
      type: '芥川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/akutagawa_l1/tileset.json',
    },
    {
      name: '淀川水系芥川洪水浸水想定区域（高槻市）',
      type: '芥川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/akutagawa_l2/tileset.json',
    },
    {
      name: '淀川水系女瀬川洪水浸水想定区域（高槻市）',
      type: '女瀬川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/nyozegawa_l1/tileset.json',
    },
    {
      name: '淀川水系女瀬川洪水浸水想定区域（高槻市）',
      type: '女瀬川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/nyozegawa_l2/tileset.json',
    },
    {
      name: '淀川水系女瀬川洪水浸水想定区域（高槻市）',
      type: '女瀬川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/nyozegawa_l1/tileset.json',
    },
    {
      name: '淀川水系女瀬川洪水浸水想定区域（高槻市）',
      type: '女瀬川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/nyozegawa_l2/tileset.json',
    },
    {
      name: '淀川水系西山川洪水浸水想定区域（高槻市）',
      type: '西山川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/nishiyamagawa_l1/tileset.json',
    },
    {
      name: '淀川水系西山川洪水浸水想定区域（高槻市）',
      type: '西山川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/nishiyamagawa_l2/tileset.json',
    },
    {
      name: '淀川水系西山川洪水浸水想定区域（高槻市）',
      type: '西山川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/nishiyamagawa_l1/tileset.json',
    },
    {
      name: '淀川水系西山川洪水浸水想定区域（高槻市）',
      type: '西山川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/nishiyamagawa_l2/tileset.json',
    },
    {
      name: '淀川水系東山川洪水浸水想定区域（高槻市）',
      type: '東山川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/higashiyamagawa_l1/tileset.json',
    },
    {
      name: '淀川水系東山川洪水浸水想定区域（高槻市）',
      type: '東山川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/higashiyamagawa_l2/tileset.json',
    },
    {
      name: '淀川水系東山川洪水浸水想定区域（高槻市）',
      type: '東山川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/higashiyamagawa_l1/tileset.json',
    },
    {
      name: '淀川水系東山川洪水浸水想定区域（高槻市）',
      type: '東山川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/higashiyamagawa_l2/tileset.json',
    },
    {
      name: '淀川水系真如寺川洪水浸水想定区域（高槻市）',
      type: '真如寺川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/shinnyojigawa_l2/tileset.json',
    },
    {
      name: '淀川水系真如寺川洪水浸水想定区域（高槻市）',
      type: '真如寺川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/shinnyojigawa_l2/tileset.json',
    },
    {
      name: '淀川水系水無瀬川洪水浸水想定区域（高槻市）',
      type: '水無瀬川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/minasegawa_l1/tileset.json',
    },
    {
      name: '淀川水系水無瀬川洪水浸水想定区域（高槻市）',
      type: '水無瀬川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/minasegawa_l2/tileset.json',
    },
    {
      name: '淀川水系水無瀬川洪水浸水想定区域（高槻市）',
      type: '水無瀬川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/minasegawa_l1/tileset.json',
    },
    {
      name: '淀川水系水無瀬川洪水浸水想定区域（高槻市）',
      type: '水無瀬川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/minasegawa_l2/tileset.json',
    },
    {
      name: '淀川水系東檜尾川洪水浸水想定区域（高槻市）',
      type: '東檜尾川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/higashihiogawa_l2/tileset.json',
    },
    {
      name: '淀川水系東檜尾川洪水浸水想定区域（高槻市）',
      type: '東檜尾川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/higashihiogawa_l2/tileset.json',
    },
    {
      name: '淀川水系檜尾川洪水浸水想定区域（高槻市）',
      type: '檜尾川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/pref/hiogawa_l2/tileset.json',
    },
    {
      name: '淀川水系檜尾川洪水浸水想定区域（高槻市）',
      type: '檜尾川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27207_takatsuki/texture_pref/hiogawa_l2/tileset.json',
    },
    {
      name: '淀川水系淀川・宇治川・木津川・桂川洪水浸水想定区域（摂津市）',
      type: '淀川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27224_settsu/notexture/yodogawa_l2/tileset.json',
    },
    {
      name: '淀川水系淀川・宇治川・木津川・桂川洪水浸水想定区域（摂津市）',
      type: '淀川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27224_settsu/texture/yodogawa_l2/tileset.json',
    },
    {
      name: '淀川水系神崎川・中嶋川・左門殿川・西島川洪水浸水想定区域（摂津市）',
      type: '神崎川・中嶋川・左門殿川・西島川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27224_settsu/pref/kanzakigawa_etc_l1/tileset.json',
    },
    {
      name: '淀川水系神崎川・中嶋川・左門殿川・西島川洪水浸水想定区域（摂津市）',
      type: '神崎川・中嶋川・左門殿川・西島川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27224_settsu/pref/kanzakigawa_etc_l2/tileset.json',
    },
    {
      name: '淀川水系神崎川・中嶋川・左門殿川・西島川洪水浸水想定区域（摂津市）',
      type: '神崎川・中嶋川・左門殿川・西島川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27224_settsu/texture_pref/kanzakigawa_etc_l1/tileset.json',
    },
    {
      name: '淀川水系神崎川・中嶋川・左門殿川・西島川洪水浸水想定区域（摂津市）',
      type: '神崎川・中嶋川・左門殿川・西島川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27224_settsu/texture_pref/kanzakigawa_etc_l2/tileset.json',
    },
    {
      name: '淀川水系安威川洪水浸水想定区域（摂津市）',
      type: '安威川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27224_settsu/pref/aigawa_l1/tileset.json',
    },
    {
      name: '淀川水系安威川洪水浸水想定区域（摂津市）',
      type: '安威川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27224_settsu/pref/aigawa_l2/tileset.json',
    },
    {
      name: '淀川水系安威川洪水浸水想定区域（摂津市）',
      type: '安威川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27224_settsu/texture_pref/aigawa_l1/tileset.json',
    },
    {
      name: '淀川水系安威川洪水浸水想定区域（摂津市）',
      type: '安威川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27224_settsu/texture_pref/aigawa_l2/tileset.json',
    },
    {
      name: '大津川水系大津川・槇尾川・東槇尾川・父鬼川・松尾川・牛滝川洪水浸水想定区域（忠岡町）',
      type: '大津川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27341_tadaoka/pref/otsugawa_l1/tileset.json',
    },
    {
      name: '大津川水系大津川・槇尾川・東槇尾川・父鬼川・松尾川・牛滝川洪水浸水想定区域（忠岡町）',
      type: '大津川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27341_tadaoka/pref/otsugawa_l2/tileset.json',
    },
    {
      name: '大津川水系大津川・槇尾川・東槇尾川・父鬼川・松尾川・牛滝川洪水浸水想定区域（忠岡町）',
      type: '大津川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27341_tadaoka/texture_pref/otsugawa_l1/tileset.json',
    },
    {
      name: '大津川水系大津川・槇尾川・東槇尾川・父鬼川・松尾川・牛滝川洪水浸水想定区域（忠岡町）',
      type: '大津川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/27341_tadaoka/texture_pref/otsugawa_l2/tileset.json',
    },
    {
      name: '大阪府津波浸水想定区域（豊中市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/27203_toyonaka/notexture/tileset.json',
    },
    {
      name: '大阪府津波浸水想定区域（豊中市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/27203_toyonaka/texture/tileset.json',
    },
    {
      name: '大阪府津波浸水想定区域（忠岡町）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/27341_tadaoka/notexture/tileset.json',
    },
    {
      name: '大阪府津波浸水想定区域（忠岡町）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/27341_tadaoka/texture/tileset.json',
    },
    {
      name: '大阪府高潮浸水想定区域（豊中市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/takashio/27203_toyonaka/notexture/tileset.json',
    },
    {
      name: '大阪府高潮浸水想定区域（豊中市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/takashio/27203_toyonaka/texture/tileset.json',
    },
    {
      name: '建物モデル（加古川市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/28210_kakogawa/notexture/tileset.json',
    },
    {
      name: '建物モデル（加古川市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/28210_kakogawa/texture/tileset.json',
    },
    {
      name: '建物モデル（加古川市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/28210_kakogawa/low_resolution/tileset.json',
    },
    {
      name: '加古川水系加古川洪水浸水想定区域（加古川市）',
      type: '加古川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/28210_kakogawa/notexture/kakogawa_l1/tileset.json',
    },
    {
      name: '加古川水系加古川洪水浸水想定区域（加古川市）',
      type: '加古川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/28210_kakogawa/notexture/kakogawa_l2/tileset.json',
    },
    {
      name: '加古川水系加古川洪水浸水想定区域（加古川市）',
      type: '加古川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/28210_kakogawa/texture/kakogawa_l1/tileset.json',
    },
    {
      name: '加古川水系加古川洪水浸水想定区域（加古川市）',
      type: '加古川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/28210_kakogawa/texture/kakogawa_l2/tileset.json',
    },
    {
      name: '加古川水系（下流圏域）洪水浸水想定区域（加古川市）',
      type: '加古川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/28210_kakogawa/pref/kakogawa_local_l1/tileset.json',
    },
    {
      name: '加古川水系（下流圏域）洪水浸水想定区域（加古川市）',
      type: '加古川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/28210_kakogawa/pref/kakogawa_local_l2/tileset.json',
    },
    {
      name: '加古川水系（下流圏域）洪水浸水想定区域（加古川市）',
      type: '加古川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/28210_kakogawa/texture_pref/kakogawa_local_l1/tileset.json',
    },
    {
      name: '加古川水系（下流圏域）洪水浸水想定区域（加古川市）',
      type: '加古川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/28210_kakogawa/texture_pref/kakogawa_local_l2/tileset.json',
    },
    {
      name: '南海トラフ巨大地震津波浸水想定図（加古川市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/28210_kakogawa/notexture/tileset.json',
    },
    {
      name: '南海トラフ巨大地震津波浸水想定図（加古川市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/28210_kakogawa/texture/tileset.json',
    },
    {
      name: '兵庫県播磨沿岸高潮浸水想定区域図（加古川市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/takashio/28210_kakogawa/notexture/tileset.json',
    },
    {
      name: '兵庫県播磨沿岸高潮浸水想定区域図（加古川市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/takashio/28210_kakogawa/texture/tileset.json',
    },
    {
      name: '建物モデル（鳥取市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/31201_tottori/notexture/tileset.json',
    },
    {
      name: '建物モデル（鳥取市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/31201_tottori/texture/tileset.json',
    },
    {
      name: '建物モデル（鳥取市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/31201_tottori/low_resolution/tileset.json',
    },
    {
      name: '千代川水系千代川洪水浸水想定区域（鳥取市）',
      type: '千代川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/notexture/sendaigawa_l1/tileset.json',
    },
    {
      name: '千代川水系千代川洪水浸水想定区域（鳥取市）',
      type: '千代川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/notexture/sendaigawa_l2/tileset.json',
    },
    {
      name: '千代川水系千代川洪水浸水想定区域（鳥取市）',
      type: '千代川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture/sendaigawa_l1/tileset.json',
    },
    {
      name: '千代川水系千代川洪水浸水想定区域（鳥取市）',
      type: '千代川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture/sendaigawa_l2/tileset.json',
    },
    {
      name: '塩見川水系塩見川洪水浸水想定区域（鳥取市）',
      type: '塩見川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/pref/shiomigawa_l1/tileset.json',
    },
    {
      name: '塩見川水系塩見川洪水浸水想定区域（鳥取市）',
      type: '塩見川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/pref/shiomigawa_l2/tileset.json',
    },
    {
      name: '塩見川水系塩見川洪水浸水想定区域（鳥取市）',
      type: '塩見川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture_pref/shiomigawa_l1/tileset.json',
    },
    {
      name: '塩見川水系塩見川洪水浸水想定区域（鳥取市）',
      type: '塩見川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture_pref/shiomigawa_l2/tileset.json',
    },
    {
      name: '河内川水系河内川洪水浸水想定区域（鳥取市）',
      type: '河内川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/pref/kouchigawa_l1/tileset.json',
    },
    {
      name: '河内川水系河内川洪水浸水想定区域（鳥取市）',
      type: '河内川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/pref/kouchigawa_l2/tileset.json',
    },
    {
      name: '河内川水系河内川洪水浸水想定区域（鳥取市）',
      type: '河内川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture_pref/kouchigawa_l1/tileset.json',
    },
    {
      name: '河内川水系河内川洪水浸水想定区域（鳥取市）',
      type: '河内川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture_pref/kouchigawa_l2/tileset.json',
    },
    {
      name: '勝部川水系勝部川・日置川洪水浸水想定区域（鳥取市）',
      type: '勝部川・日置川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/pref/kachibegawa_l1/tileset.json',
    },
    {
      name: '勝部川水系勝部川・日置川洪水浸水想定区域（鳥取市）',
      type: '勝部川・日置川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/pref/kachibegawa_l2/tileset.json',
    },
    {
      name: '勝部川水系勝部川・日置川洪水浸水想定区域（鳥取市）',
      type: '勝部川・日置川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture_pref/kachibegawa_l1/tileset.json',
    },
    {
      name: '勝部川水系勝部川・日置川洪水浸水想定区域（鳥取市）',
      type: '勝部川・日置川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture_pref/kachibegawa_l2/tileset.json',
    },
    {
      name: '千代川水系大路川洪水浸水想定区域（鳥取市）',
      type: '大路川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/pref/oorogawa_l1/tileset.json',
    },
    {
      name: '千代川水系大路川洪水浸水想定区域（鳥取市）',
      type: '大路川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/pref/oorogawa_l2/tileset.json',
    },
    {
      name: '千代川水系大路川洪水浸水想定区域（鳥取市）',
      type: '大路川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture_pref/oorogawa_l1/tileset.json',
    },
    {
      name: '千代川水系大路川洪水浸水想定区域（鳥取市）',
      type: '大路川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture_pref/oorogawa_l2/tileset.json',
    },
    {
      name: '千代川水系野坂川洪水浸水想定区域（鳥取市）',
      type: '野坂川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/pref/nosakagawa_l1/tileset.json',
    },
    {
      name: '千代川水系野坂川洪水浸水想定区域（鳥取市）',
      type: '野坂川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/pref/nosakagawa_l2/tileset.json',
    },
    {
      name: '千代川水系野坂川洪水浸水想定区域（鳥取市）',
      type: '野坂川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture_pref/nosakagawa_l1/tileset.json',
    },
    {
      name: '千代川水系野坂川洪水浸水想定区域（鳥取市）',
      type: '野坂川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/31201_tottori/texture_pref/nosakagawa_l2/tileset.json',
    },
    {
      name: '鳥取県津波浸水想定区域（鳥取市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/31201_tottori/notexture/tileset.json',
    },
    {
      name: '鳥取県津波浸水想定区域（鳥取市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/31201_tottori/texture/tileset.json',
    },
    {
      name: '建物モデル（呉市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/34202_kure/notexture/tileset.json',
    },
    {
      name: '建物モデル（福山市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/34207_fukuyama/notexture/tileset.json',
    },
    {
      name: '建物モデル（福山市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/34207_fukuyama/texture/tileset.json',
    },
    {
      name: '建物モデル（福山市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/34207_fukuyama/low_resolution/tileset.json',
    },
    {
      name: '黒瀬川水系黒瀬川洪水浸水想定区域（呉市）',
      type: '黒瀬川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34202_kure/pref/kurosegawa_l1/tileset.json',
    },
    {
      name: '黒瀬川水系黒瀬川洪水浸水想定区域（呉市）',
      type: '黒瀬川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34202_kure/pref/kurosegawa_l2/tileset.json',
    },
    {
      name: '黒瀬川水系黒瀬川洪水浸水想定区域（呉市）',
      type: '黒瀬川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34202_kure/texture_pref/kurosegawa_l1/tileset.json',
    },
    {
      name: '黒瀬川水系黒瀬川洪水浸水想定区域（呉市）',
      type: '黒瀬川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34202_kure/texture_pref/kurosegawa_l2/tileset.json',
    },
    {
      name: '芦田川水系芦田川洪水浸水想定区域（福山市）',
      type: '芦田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34207_fukuyama/notexture/ashidagawa_l1/tileset.json',
    },
    {
      name: '芦田川水系芦田川洪水浸水想定区域（福山市）',
      type: '芦田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34207_fukuyama/notexture/ashidagawa_l2/tileset.json',
    },
    {
      name: '芦田川水系芦田川洪水浸水想定区域（福山市）',
      type: '芦田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34207_fukuyama/texture/ashidagawa_l1/tileset.json',
    },
    {
      name: '芦田川水系芦田川洪水浸水想定区域（福山市）',
      type: '芦田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34207_fukuyama/texture/ashidagawa_l2/tileset.json',
    },
    {
      name: '芦田川水系高屋川洪水浸水想定区域（福山市）',
      type: '高屋川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34207_fukuyama/notexture/takayagawa_l1/tileset.json',
    },
    {
      name: '芦田川水系高屋川洪水浸水想定区域（福山市）',
      type: '高屋川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34207_fukuyama/notexture/takayagawa_l2/tileset.json',
    },
    {
      name: '芦田川水系高屋川洪水浸水想定区域（福山市）',
      type: '高屋川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34207_fukuyama/texture/takayagawa_l1/tileset.json',
    },
    {
      name: '芦田川水系高屋川洪水浸水想定区域（福山市）',
      type: '高屋川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/34207_fukuyama/texture/takayagawa_l2/tileset.json',
    },
    {
      name: '広島県津波浸水想定区域（呉市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/34202_kure/notexture/tileset.json',
    },
    {
      name: '広島県津波浸水想定区域（呉市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/34202_kure/texture/tileset.json',
    },
    {
      name: '広島県津波浸水想定区域（福山市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/34207_fukuyama/notexture/tileset.json',
    },
    {
      name: '広島県津波浸水想定区域（福山市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/34207_fukuyama/texture/tileset.json',
    },
    {
      name: '建物モデル（松山市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/38201_matsuyama/notexture/tileset.json',
    },
    {
      name: '建物モデル（松山市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/38201_matsuyama/texture/tileset.json',
    },
    {
      name: '建物モデル（松山市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/38201_matsuyama/low_resolution/tileset.json',
    },
    {
      name: '重信川水系重信川洪水浸水想定区域（松山市）',
      type: '重信川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/38201_matsuyama/notexture/shigenobugawa_l1/tileset.json',
    },
    {
      name: '重信川水系重信川洪水浸水想定区域（松山市）',
      type: '重信川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/38201_matsuyama/notexture/shigenobugawa_l2/tileset.json',
    },
    {
      name: '重信川水系重信川洪水浸水想定区域（松山市）',
      type: '重信川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/38201_matsuyama/texture/shigenobugawa_l1/tileset.json',
    },
    {
      name: '重信川水系重信川洪水浸水想定区域（松山市）',
      type: '重信川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/38201_matsuyama/texture/shigenobugawa_l2/tileset.json',
    },
    {
      name: '重信川水系石手川洪水浸水想定区域（松山市）',
      type: '石手川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/38201_matsuyama/notexture/ishitegawa_l1/tileset.json',
    },
    {
      name: '重信川水系石手川洪水浸水想定区域（松山市）',
      type: '石手川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/38201_matsuyama/notexture/ishitegawa_l2/tileset.json',
    },
    {
      name: '重信川水系石手川洪水浸水想定区域（松山市）',
      type: '石手川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/38201_matsuyama/texture/ishitegawa_l1/tileset.json',
    },
    {
      name: '重信川水系石手川洪水浸水想定区域（松山市）',
      type: '石手川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/38201_matsuyama/texture/ishitegawa_l2/tileset.json',
    },
    {
      name: '愛媛県津波浸水想定区域（松山市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/38201_matsuyama/notexture/tileset.json',
    },
    {
      name: '愛媛県津波浸水想定区域（松山市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/38201_matsuyama/texture/tileset.json',
    },
    {
      name: '建物モデル（北九州市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/40100_kitakyushu/notexture/tileset.json',
    },
    {
      name: '建物モデル（北九州市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/40100_kitakyushu/texture/tileset.json',
    },
    {
      name: '建物モデル（北九州市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/40100_kitakyushu/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（久留米市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/40203_kurume/notexture/tileset.json',
    },
    {
      name: '建物モデル（久留米市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/40203_kurume/texture/tileset.json',
    },
    {
      name: '建物モデル（久留米市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/40203_kurume/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（飯塚市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/40205_iizuka/notexture/tileset.json',
    },
    {
      name: '建物モデル（飯塚市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/40205_iizuka/texture/tileset.json',
    },
    {
      name: '建物モデル（飯塚市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/40205_iizuka/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（宗像市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/40220_munakata/notexture/tileset.json',
    },
    {
      name: '遠賀川水系遠賀川洪水浸水想定区域（北九州市）',
      type: '遠賀川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/notexture/ongagawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系遠賀川洪水浸水想定区域（北九州市）',
      type: '遠賀川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/notexture/ongagawa_l2/tileset.json',
    },
    {
      name: '遠賀川水系遠賀川洪水浸水想定区域（北九州市）',
      type: '遠賀川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/texture/ongagawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系遠賀川洪水浸水想定区域（北九州市）',
      type: '遠賀川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/texture/ongagawa_l2/tileset.json',
    },
    {
      name: '紫川水系紫川・東谷川洪水浸水想定区域（北九州市）',
      type: '紫川・東谷川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/pref/murasakigawa_etc_l1/tileset.json',
    },
    {
      name: '紫川水系紫川・東谷川洪水浸水想定区域（北九州市）',
      type: '紫川・東谷川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/texture_pref/murasakigawa_etc_l1/tileset.json',
    },
    {
      name: '板櫃川水系板櫃川洪水浸水想定区域（北九州市）',
      type: '板櫃川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/pref/itabitsugawa_l1/tileset.json',
    },
    {
      name: '板櫃川水系板櫃川洪水浸水想定区域（北九州市）',
      type: '板櫃川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/pref/itabitsugawa_l2/tileset.json',
    },
    {
      name: '板櫃川水系板櫃川洪水浸水想定区域（北九州市）',
      type: '板櫃川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/texture_pref/itabitsugawa_l1/tileset.json',
    },
    {
      name: '板櫃川水系板櫃川洪水浸水想定区域（北九州市）',
      type: '板櫃川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/texture_pref/itabitsugawa_l2/tileset.json',
    },
    {
      name: '竹馬川水系竹馬川洪水浸水想定区域（北九州市）',
      type: '竹馬川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/pref/chikumagawa_l1/tileset.json',
    },
    {
      name: '竹馬川水系竹馬川洪水浸水想定区域（北九州市）',
      type: '竹馬川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/pref/chikumagawa_l2/tileset.json',
    },
    {
      name: '竹馬川水系竹馬川洪水浸水想定区域（北九州市）',
      type: '竹馬川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/texture_pref/chikumagawa_l1/tileset.json',
    },
    {
      name: '竹馬川水系竹馬川洪水浸水想定区域（北九州市）',
      type: '竹馬川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/texture_pref/chikumagawa_l2/tileset.json',
    },
    {
      name: '金山川水系金山川洪水浸水想定区域（北九州市）',
      type: '金山川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/pref/kinzangawa_l1/tileset.json',
    },
    {
      name: '金山川水系金山川洪水浸水想定区域（北九州市）',
      type: '金山川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/pref/kinzangawa_l2/tileset.json',
    },
    {
      name: '金山川水系金山川洪水浸水想定区域（北九州市）',
      type: '金山川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/texture_pref/kinzangawa_l1/tileset.json',
    },
    {
      name: '金山川水系金山川洪水浸水想定区域（北九州市）',
      type: '金山川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40100_kitakyushu/texture_pref/kinzangawa_l2/tileset.json',
    },
    {
      name: '筑後川水系筑後川洪水浸水想定区域（久留米市）',
      type: '筑後川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/chikugogawa_l1/tileset.json',
    },
    {
      name: '筑後川水系筑後川洪水浸水想定区域（久留米市）',
      type: '筑後川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/chikugogawa_l2/tileset.json',
    },
    {
      name: '筑後川水系筑後川洪水浸水想定区域（久留米市）',
      type: '筑後川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/chikugogawa_l1/tileset.json',
    },
    {
      name: '筑後川水系筑後川洪水浸水想定区域（久留米市）',
      type: '筑後川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/chikugogawa_l2/tileset.json',
    },
    {
      name: '筑後川水系広川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '広川（直轄管理区間）L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/hirokawa_n_l1/tileset.json',
    },
    {
      name: '筑後川水系広川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '広川（直轄管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/hirokawa_n_l2/tileset.json',
    },
    {
      name: '筑後川水系広川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '広川（直轄管理区間）L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/hirokawa_n_l1/tileset.json',
    },
    {
      name: '筑後川水系広川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '広川（直轄管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/hirokawa_n_l2/tileset.json',
    },
    {
      name: '筑後川水系田手川洪水浸水想定区域（久留米市）',
      type: '田手川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/tadegawa_l1/tileset.json',
    },
    {
      name: '筑後川水系田手川洪水浸水想定区域（久留米市）',
      type: '田手川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/tadegawa_l2/tileset.json',
    },
    {
      name: '筑後川水系田手川洪水浸水想定区域（久留米市）',
      type: '田手川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/tadegawa_l1/tileset.json',
    },
    {
      name: '筑後川水系田手川洪水浸水想定区域（久留米市）',
      type: '田手川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/tadegawa_l2/tileset.json',
    },
    {
      name: '筑後川水系宝満川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '宝満川（直轄管理区間）L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/houmangawa_n_l1/tileset.json',
    },
    {
      name: '筑後川水系宝満川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '宝満川（直轄管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/houmangawa_n_l2/tileset.json',
    },
    {
      name: '筑後川水系宝満川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '宝満川（直轄管理区間）L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/houmangawa_n_l1/tileset.json',
    },
    {
      name: '筑後川水系宝満川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '宝満川（直轄管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/houmangawa_n_l2/tileset.json',
    },
    {
      name: '筑後川水系巨瀬川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '巨瀬川（直轄管理区間）L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/kosegawa_n_l1/tileset.json',
    },
    {
      name: '筑後川水系巨瀬川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '巨瀬川（直轄管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/kosegawa_n_l2/tileset.json',
    },
    {
      name: '筑後川水系巨瀬川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '巨瀬川（直轄管理区間）L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/kosegawa_n_l1/tileset.json',
    },
    {
      name: '筑後川水系巨瀬川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '巨瀬川（直轄管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/kosegawa_n_l2/tileset.json',
    },
    {
      name: '筑後川水系小石原川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '小石原川（直轄管理区間）L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/koishiwaragawa_n_l1/tileset.json',
    },
    {
      name: '筑後川水系小石原川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '小石原川（直轄管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/koishiwaragawa_n_l2/tileset.json',
    },
    {
      name: '筑後川水系小石原川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '小石原川（直轄管理区間）L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/koishiwaragawa_n_l1/tileset.json',
    },
    {
      name: '筑後川水系小石原川洪水浸水想定区域（直轄管理区間）（久留米市）',
      type: '小石原川（直轄管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/koishiwaragawa_n_l2/tileset.json',
    },
    {
      name: '筑後川水系佐田川洪水浸水想定区域図（久留米市）',
      type: '佐田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/sadagawa_l1/tileset.json',
    },
    {
      name: '筑後川水系佐田川洪水浸水想定区域図（久留米市）',
      type: '佐田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/sadagawa_l2/tileset.json',
    },
    {
      name: '筑後川水系佐田川洪水浸水想定区域図（久留米市）',
      type: '佐田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/sadagawa_l1/tileset.json',
    },
    {
      name: '筑後川水系佐田川洪水浸水想定区域図（久留米市）',
      type: '佐田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/sadagawa_l2/tileset.json',
    },
    {
      name: '筑後川水系隈上川洪水浸水想定区域（久留米市）',
      type: '隈上川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/kumanouegawa_l1/tileset.json',
    },
    {
      name: '筑後川水系隈上川洪水浸水想定区域（久留米市）',
      type: '隈上川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/kumanouegawa_l2/tileset.json',
    },
    {
      name: '筑後川水系隈上川洪水浸水想定区域（久留米市）',
      type: '隈上川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/kumanouegawa_l1/tileset.json',
    },
    {
      name: '筑後川水系隈上川洪水浸水想定区域（久留米市）',
      type: '隈上川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/kumanouegawa_l2/tileset.json',
    },
    {
      name: '矢部川水系矢部川洪水浸水想定区域（久留米市）',
      type: '矢部川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/notexture/yabegawa_l2/tileset.json',
    },
    {
      name: '矢部川水系矢部川洪水浸水想定区域（久留米市）',
      type: '矢部川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture/yabegawa_l2/tileset.json',
    },
    {
      name: '筑後川水系広川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '広川（県管理区間）L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/hirokawa_l1/tileset.json',
    },
    {
      name: '筑後川水系広川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '広川（県管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/hirokawa_l2/tileset.json',
    },
    {
      name: '筑後川水系広川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '広川（県管理区間）L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/hirokawa_l1/tileset.json',
    },
    {
      name: '筑後川水系広川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '広川（県管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/hirokawa_l2/tileset.json',
    },
    {
      name: '筑後川水系宝満川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '宝満川（県管理区間）L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/houmangawa_l1/tileset.json',
    },
    {
      name: '筑後川水系宝満川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '宝満川（県管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/houmangawa_l2/tileset.json',
    },
    {
      name: '筑後川水系宝満川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '宝満川（県管理区間）L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/houmangawa_l1/tileset.json',
    },
    {
      name: '筑後川水系宝満川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '宝満川（県管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/houmangawa_l2/tileset.json',
    },
    {
      name: '筑後川水系小石原川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '小石原川（県管理区間）L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/koishiwaragawa_l1/tileset.json',
    },
    {
      name: '筑後川水系小石原川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '小石原川（県管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/koishiwaragawa_l2/tileset.json',
    },
    {
      name: '筑後川水系小石原川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '小石原川（県管理区間）L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/koishiwaragawa_l1/tileset.json',
    },
    {
      name: '筑後川水系小石原川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '小石原川（県管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/koishiwaragawa_l2/tileset.json',
    },
    {
      name: '筑後川水系巨瀬川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '巨瀬川（県管理区間）L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/kosegawa_l1/tileset.json',
    },
    {
      name: '筑後川水系巨瀬川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '巨瀬川（県管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/kosegawa_l2/tileset.json',
    },
    {
      name: '筑後川水系巨瀬川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '巨瀬川（県管理区間）L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/kosegawa_l1/tileset.json',
    },
    {
      name: '筑後川水系巨瀬川洪水浸水想定区域（県管理区間）（久留米市）',
      type: '巨瀬川（県管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/kosegawa_l2/tileset.json',
    },
    {
      name: '筑後川水系高良川洪水浸水想定区域（久留米市）',
      type: '高良川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/kouragawa_l1/tileset.json',
    },
    {
      name: '筑後川水系高良川洪水浸水想定区域（久留米市）',
      type: '高良川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/kouragawa_l2/tileset.json',
    },
    {
      name: '筑後川水系高良川洪水浸水想定区域（久留米市）',
      type: '高良川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/kouragawa_l1/tileset.json',
    },
    {
      name: '筑後川水系高良川洪水浸水想定区域（久留米市）',
      type: '高良川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/kouragawa_l2/tileset.json',
    },
    {
      name: '筑後川水系太刀洗川洪水浸水想定区域（久留米市）',
      type: '太刀洗川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/tachiaraigawa_l1/tileset.json',
    },
    {
      name: '筑後川水系太刀洗川洪水浸水想定区域（久留米市）',
      type: '太刀洗川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/pref/tachiaraigawa_l2/tileset.json',
    },
    {
      name: '筑後川水系太刀洗川洪水浸水想定区域（久留米市）',
      type: '太刀洗川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/tachiaraigawa_l1/tileset.json',
    },
    {
      name: '筑後川水系太刀洗川洪水浸水想定区域（久留米市）',
      type: '太刀洗川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40203_kurume/texture_pref/tachiaraigawa_l2/tileset.json',
    },
    {
      name: '遠賀川水系遠賀川洪水浸水想定区域（飯塚市）',
      type: '遠賀川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/notexture/ongagawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系遠賀川洪水浸水想定区域（飯塚市）',
      type: '遠賀川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/notexture/ongagawa_l2/tileset.json',
    },
    {
      name: '遠賀川水系遠賀川洪水浸水想定区域（飯塚市）',
      type: '遠賀川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/texture/ongagawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系遠賀川洪水浸水想定区域（飯塚市）',
      type: '遠賀川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/texture/ongagawa_l2/tileset.json',
    },
    {
      name: '遠賀川水系泉河内川洪水浸水想定区域（飯塚市）',
      type: '泉河内川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/pref/izumigouchigawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系泉河内川洪水浸水想定区域（飯塚市）',
      type: '泉河内川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/pref/izumigouchigawa_l2/tileset.json',
    },
    {
      name: '遠賀川水系泉河内川洪水浸水想定区域（飯塚市）',
      type: '泉河内川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/texture_pref/izumigouchigawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系泉河内川洪水浸水想定区域（飯塚市）',
      type: '泉河内川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/texture_pref/izumigouchigawa_l2/tileset.json',
    },
    {
      name: '遠賀川水系穂波川洪水浸水想定区域（飯塚市）',
      type: '穂波川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/pref/honamigawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系穂波川洪水浸水想定区域（飯塚市）',
      type: '穂波川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/pref/honamigawa_l2/tileset.json',
    },
    {
      name: '遠賀川水系穂波川洪水浸水想定区域（飯塚市）',
      type: '穂波川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/texture_pref/honamigawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系穂波川洪水浸水想定区域（飯塚市）',
      type: '穂波川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/texture_pref/honamigawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系庄内川洪水浸水想定区域（飯塚市）',
      type: '庄内川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/pref/shounaigawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系庄内川洪水浸水想定区域（飯塚市）',
      type: '庄内川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/pref/shounaigawa_l2/tileset.json',
    },
    {
      name: '遠賀川水系庄内川洪水浸水想定区域（飯塚市）',
      type: '庄内川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/texture_pref/shounaigawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系庄内川洪水浸水想定区域（飯塚市）',
      type: '庄内川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/texture_pref/shounaigawa_l2/tileset.json',
    },
    {
      name: '遠賀川水系建花寺川浸水想定区域（飯塚市）',
      type: '建花寺川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/pref/kengeijigawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系建花寺川浸水想定区域（飯塚市）',
      type: '建花寺川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/pref/kengeijigawa_l2/tileset.json',
    },
    {
      name: '遠賀川水系建花寺川浸水想定区域（飯塚市）',
      type: '建花寺川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/texture_pref/kengeijigawa_l1/tileset.json',
    },
    {
      name: '遠賀川水系建花寺川浸水想定区域（飯塚市）',
      type: '建花寺川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40205_iizuka/texture_pref/kengeijigawa_l2/tileset.json',
    },
    {
      name: '釣川水系釣川・八並川・山田川洪水浸水想定区域（宗像市）',
      type: '釣川・八並川・山田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40220_munakata/pref/tsurikawa_l1/tileset.json',
    },
    {
      name: '釣川水系釣川・八並川・山田川洪水浸水想定区域（宗像市）',
      type: '釣川・八並川・山田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40220_munakata/pref/tsurikawa_l2/tileset.json',
    },
    {
      name: '釣川水系釣川・八並川・山田川洪水浸水想定区域（宗像市）',
      type: '八並川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40220_munakata/pref/yatsunamigawa_l2/tileset.json',
    },
    {
      name: '釣川水系釣川・八並川・山田川洪水浸水想定区域（宗像市）',
      type: '山田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40220_munakata/pref/yamadagawa_l2/tileset.json',
    },
    {
      name: '釣川水系釣川・八並川・山田川洪水浸水想定区域（宗像市）',
      type: '釣川・八並川・山田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40220_munakata/texture_pref/tsurikawa_l1/tileset.json',
    },
    {
      name: '釣川水系釣川・八並川・山田川洪水浸水想定区域（宗像市）',
      type: '釣川・八並川・山田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40220_munakata/texture_pref/tsurikawa_l2/tileset.json',
    },
    {
      name: '釣川水系釣川・八並川・山田川洪水浸水想定区域（宗像市）',
      type: '八並川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40220_munakata/texture_pref/yatsunamigawa_l2/tileset.json',
    },
    {
      name: '釣川水系釣川・八並川・山田川洪水浸水想定区域（宗像市）',
      type: '山田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/40220_munakata/texture_pref/yamadagawa_l2/tileset.json',
    },
    {
      name: '福岡県津波浸水想定区域（北九州市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/40100_kitakyushu/notexture/tileset.json',
    },
    {
      name: '福岡県津波浸水想定区域（北九州市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/40100_kitakyushu/texture/tileset.json',
    },
    {
      name: '福岡県津波浸水想定区域（宗像市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/40220_munakata/notexture/tileset.json',
    },
    {
      name: '福岡県津波浸水想定区域（宗像市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/40220_munakata/texture/tileset.json',
    },
    {
      name: '有明海沿岸高潮浸水想定（久留米市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/takashio/40203_kurume/notexture/tileset.json',
    },
    {
      name: '有明海沿岸高潮浸水想定（久留米市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/takashio/40203_kurume/texture/tileset.json',
    },
    {
      name: '玄界灘沿岸高潮浸水想定（宗像市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/takashio/40220_munakata/notexture/tileset.json',
    },
    {
      name: '玄界灘沿岸高潮浸水想定（宗像市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/takashio/40220_munakata/texture/tileset.json',
    },
    {
      name: '建物モデル（熊本市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43100_kumamoto/notexture/tileset.json',
    },
    {
      name: '建物モデル（熊本市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43100_kumamoto/texture/tileset.json',
    },
    {
      name: '建物モデル（熊本市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43100_kumamoto/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（荒尾市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43204_arao/notexture/tileset.json',
    },
    {
      name: '建物モデル（荒尾市）',
      type: 'テクスチャ付き（屋根のみ）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43204_arao/texture/tileset.json',
    },
    {
      name: '建物モデル（荒尾市）',
      type: 'テクスチャ付き（屋根のみ・低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43204_arao/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（玉名市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43206_tamana/notexture/tileset.json',
    },
    {
      name: '建物モデル（玉名市）',
      type: 'テクスチャ付き（屋根のみ）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43206_tamana/texture/tileset.json',
    },
    {
      name: '建物モデル（玉名市）',
      type: 'テクスチャ付き（屋根のみ・低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43206_tamana/low_resolution/tileset.json',
    },
    {
      name: '建物モデル（益城町）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43443_mashiki/notexture/tileset.json',
    },
    {
      name: '建物モデル（益城町）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43443_mashiki/texture/tileset.json',
    },
    {
      name: '建物モデル（益城町）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/43443_mashiki/low_resolution/tileset.json',
    },
    {
      name: '菊池川水系浸水想定区域図（玉名市）',
      type: '菊池川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/43206_tamana/notexture/kikuchigawa_l1/tileset.json',
    },
    {
      name: '菊池川水系浸水想定区域図（玉名市）',
      type: '菊池川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/43206_tamana/notexture/kikuchigawa_l2/tileset.json',
    },
    {
      name: '菊池川水系浸水想定区域図（玉名市）',
      type: '菊池川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/43206_tamana/texture/kikuchigawa_l1/tileset.json',
    },
    {
      name: '菊池川水系浸水想定区域図（玉名市）',
      type: '菊池川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/43206_tamana/texture/kikuchigawa_l2/tileset.json',
    },
    {
      name: '緑川水系木山川洪水浸水想定区域（益城町）',
      type: '木山川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/43443_mashiki/pref/kiyamagawa_l1/tileset.json',
    },
    {
      name: '緑川水系木山川洪水浸水想定区域（益城町）',
      type: '木山川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/43443_mashiki/pref/kiyamagawa_l2/tileset.json',
    },
    {
      name: '緑川水系木山川洪水浸水想定区域（益城町）',
      type: '木山川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/43443_mashiki/texture_pref/kiyamagawa_l1/tileset.json',
    },
    {
      name: '緑川水系木山川洪水浸水想定区域（益城町）',
      type: '木山川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/43443_mashiki/texture_pref/kiyamagawa_l2/tileset.json',
    },
    {
      name: '熊本県津波浸水想定区域（玉名市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/43206_tamana/notexture/tileset.json',
    },
    {
      name: '熊本県津波浸水想定区域（玉名市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/43206_tamana/texture/tileset.json',
    },
    {
      name: '建物モデル（日田市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/44204_hita/notexture/tileset.json',
    },
    {
      name: '建物モデル（日田市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/44204_hita/texture/tileset.json',
    },
    {
      name: '建物モデル（日田市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/44204_hita/low_resolution/tileset.json',
    },
    {
      name: '筑後川水系筑後川洪水浸水想定区域（日田市）',
      type: '筑後川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/notexture/chikugogawa_l1/tileset.json',
    },
    {
      name: '筑後川水系筑後川洪水浸水想定区域（日田市）',
      type: '筑後川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/notexture/chikugogawa_l2/tileset.json',
    },
    {
      name: '筑後川水系筑後川洪水浸水想定区域（日田市）',
      type: '筑後川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture/chikugogawa_l1/tileset.json',
    },
    {
      name: '筑後川水系筑後川洪水浸水想定区域（日田市）',
      type: '筑後川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture/chikugogawa_l2/tileset.json',
    },
    {
      name: '筑後川水系花月川洪水浸水想定区域（日田市）',
      type: '花月川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/notexture/kagetsugawa_l1/tileset.json',
    },
    {
      name: '筑後川水系花月川洪水浸水想定区域（日田市）',
      type: '花月川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/notexture/kagetsugawa_l2/tileset.json',
    },
    {
      name: '筑後川水系花月川洪水浸水想定区域（日田市）',
      type: '花月川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture/kagetsugawa_l1/tileset.json',
    },
    {
      name: '筑後川水系花月川洪水浸水想定区域（日田市）',
      type: '花月川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture/kagetsugawa_l2/tileset.json',
    },
    {
      name: '筑後川水系玖珠川洪水浸水想定区域図（直轄管理区間）（日田市）',
      type: '玖珠川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/notexture/kusugawa_l2/tileset.json',
    },
    {
      name: '筑後川水系玖珠川洪水浸水想定区域図（直轄管理区間）（日田市）',
      type: '玖珠川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture/kusugawa_l2/tileset.json',
    },
    {
      name: '筑後川水系隈川洪水浸水想定区域（日田市）',
      type: '隈川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/notexture/kumagawa_l2/tileset.json',
    },
    {
      name: '筑後川水系隈川洪水浸水想定区域（日田市）',
      type: '隈川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture/kumagawa_l2/tileset.json',
    },
    {
      name: '筑後川水系庄手川洪水浸水想定区域（日田市）',
      type: '庄手川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/notexture/shodegawa_l1/tileset.json',
    },
    {
      name: '筑後川水系庄手川洪水浸水想定区域（日田市）',
      type: '庄手川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/notexture/shodegawa_l2/tileset.json',
    },
    {
      name: '筑後川水系庄手川洪水浸水想定区域（日田市）',
      type: '庄手川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture/shodegawa_l1/tileset.json',
    },
    {
      name: '筑後川水系庄手川洪水浸水想定区域（日田市）',
      type: '庄手川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture/shodegawa_l2/tileset.json',
    },
    {
      name: '筑後川水系玖珠川洪水浸水想定区域（県管理区間）（日田市）',
      type: '玖珠川（県管理区間）L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/kusugawa_local_l1/tileset.json',
    },
    {
      name: '筑後川水系玖珠川洪水浸水想定区域（県管理区間）（日田市）',
      type: '玖珠川（県管理区間）L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/kusugawa_local_l2/tileset.json',
    },
    {
      name: '筑後川水系玖珠川洪水浸水想定区域（県管理区間）（日田市）',
      type: '玖珠川（県管理区間）L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/kusugawa_local_l1/tileset.json',
    },
    {
      name: '筑後川水系玖珠川洪水浸水想定区域（県管理区間）（日田市）',
      type: '玖珠川（県管理区間）L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/kusugawa_local_l2/tileset.json',
    },
    {
      name: '筑後川水系有田川洪水浸水想定区域（日田市）',
      type: '有田川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/aritagawa_l1/tileset.json',
    },
    {
      name: '筑後川水系有田川洪水浸水想定区域（日田市）',
      type: '有田川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/aritagawa_l2/tileset.json',
    },
    {
      name: '筑後川水系有田川洪水浸水想定区域（日田市）',
      type: '有田川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/aritagawa_l1/tileset.json',
    },
    {
      name: '筑後川水系有田川洪水浸水想定区域（日田市）',
      type: '有田川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/aritagawa_l2/tileset.json',
    },
    {
      name: '筑後川水系串川洪水浸水想定区域（日田市）',
      type: '串川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/kushikawa_l1/tileset.json',
    },
    {
      name: '筑後川水系串川洪水浸水想定区域（日田市）',
      type: '串川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/kushikawa_l2/tileset.json',
    },
    {
      name: '筑後川水系串川洪水浸水想定区域（日田市）',
      type: '串川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/kushikawa_l1/tileset.json',
    },
    {
      name: '筑後川水系串川洪水浸水想定区域（日田市）',
      type: '串川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/kushikawa_l2/tileset.json',
    },
    {
      name: '筑後川水系高瀬川洪水浸水想定区域（日田市）',
      type: '高瀬川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/takasegawa_l1/tileset.json',
    },
    {
      name: '筑後川水系高瀬川洪水浸水想定区域（日田市）',
      type: '高瀬川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/takasegawa_l2/tileset.json',
    },
    {
      name: '筑後川水系高瀬川洪水浸水想定区域（日田市）',
      type: '高瀬川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/takasegawa_l1/tileset.json',
    },
    {
      name: '筑後川水系高瀬川洪水浸水想定区域（日田市）',
      type: '高瀬川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/takasegawa_l2/tileset.json',
    },
    {
      name: '筑後川水系吾々路川洪水浸水想定区域図（日田市）',
      type: '吾々路川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/gogorogawa_l2/tileset.json',
    },
    {
      name: '筑後川水系吾々路川洪水浸水想定区域図（日田市）',
      type: '吾々路川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/gogorogawa_l2/tileset.json',
    },
    {
      name: '筑後川水系赤石川洪水浸水想定区域図（日田市）',
      type: '赤石川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/akaishigawa_l2/tileset.json',
    },
    {
      name: '筑後川水系赤石川洪水浸水想定区域図（日田市）',
      type: '赤石川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/akaishigawa_l2/tileset.json',
    },
    {
      name: '筑後川水系渡里川洪水浸水想定区域図（日田市）',
      type: '渡里川L1（計画規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/watarigawa_l1/tileset.json',
    },
    {
      name: '筑後川水系渡里川洪水浸水想定区域図（日田市）',
      type: '渡里川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/pref/watarigawa_l2/tileset.json',
    },
    {
      name: '筑後川水系渡里川洪水浸水想定区域図（日田市）',
      type: '渡里川L1（計画規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/watarigawa_l1/tileset.json',
    },
    {
      name: '筑後川水系渡里川洪水浸水想定区域図（日田市）',
      type: '渡里川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/44204_hita/texture_pref/watarigawa_l2/tileset.json',
    },
    {
      name: '日田市内水ハザードマップ（日田市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/naisui/44204_hita/notexture/tileset.json',
    },
    {
      name: '日田市内水ハザードマップ（日田市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/naisui/44204_hita/texture/tileset.json',
    },
    {
      name: '建物モデル（那覇市）',
      type: 'テクスチャなし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/47201_naha/notexture/tileset.json',
    },
    {
      name: '建物モデル（那覇市）',
      type: 'テクスチャ付き',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/47201_naha/texture/tileset.json',
    },
    {
      name: '建物モデル（那覇市）',
      type: 'テクスチャ付き（低解像度）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/47201_naha/low_resolution/tileset.json',
    },
    {
      name: '安里川水系洪水浸水想定区域(安里川・真嘉比川・久茂地川)（那覇市）',
      type: '安里川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/47201_naha/pref/asatogawa_l2/tileset.json',
    },
    {
      name: '安里川水系洪水浸水想定区域(安里川・真嘉比川・久茂地川)（那覇市）',
      type: '安里川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/47201_naha/texture_pref/asatogawa_l2/tileset.json',
    },
    {
      name: '国場川水系国場川洪水浸水想定区域（那覇市）',
      type: '国場川L2（想定最大規模）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/47201_naha/pref/kokubagawa_l2/tileset.json',
    },
    {
      name: '国場川水系国場川洪水浸水想定区域（那覇市）',
      type: '国場川L2（想定最大規模）（水面表現）',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/fld/47201_naha/texture_pref/kokubagawa_l2/tileset.json',
    },
    {
      name: '沖縄県津波浸水想定区域（那覇市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/47201_naha/notexture/tileset.json',
    },
    {
      name: '沖縄県津波浸水想定区域（那覇市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/tsunami/47201_naha/texture/tileset.json',
    },
    {
      name: '沖縄県高潮浸水予測図（那覇市）',
      type: '水面表現なし',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/takashio/47201_naha/notexture/tileset.json',
    },
    {
      name: '沖縄県高潮浸水予測図（那覇市）',
      type: '水面表現あり',
      url: 'https://plateau.geospatial.jp/main/data/3d-tiles/takashio/47201_naha/texture/tileset.json',
    },
  ]

  public static getBuildings(): TilesetData[] {
    return this.tilesets.filter((t) => t.name.startsWith('建物モデル'))
  }

  public static getBuildingsNoTexture(): TilesetData[] {
    return this.tilesets.filter(
      (t) => t.name.startsWith('建物モデル') && t.type === 'テクスチャなし'
    )
  }
}
