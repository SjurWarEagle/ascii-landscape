import {TileFilling} from "../types/tile-filling";

export class ContentTileFillingData {
  public readonly mapping: TileFilling = new TileFilling();

  constructor() {
    this.mapping.data.push(
      {
        source: '⛰',
        candidates: [
          { tile: '⛰', weight: 2 },
          { tile: '🌋', weight: 0.1 },
          { tile: '🗻', weight: 1 },
          { tile: '🌲', weight: 1 },
          { tile: ' ', weight: 2 },
        ],
      },
      {
        source: '🌋',
        candidates: [
          { tile: '⛰', weight: 1 },
          { tile: '🗻', weight: 2 },
        ],
      },
      {
        source: '🗻',
        candidates: [
          { tile: '🗻', weight: 1 },
          { tile: '⛰', weight: 2 },
          { tile: '🌲', weight: 1 },
          { tile: '🌳', weight: 1 },
          { tile: ' ', weight: 2 },
        ],
      },
      {
        source: '🌳',
        candidates: [
          { tile: '⛰', weight: 3 },
          { tile: '🌲', weight: 5 },
          { tile: '🌳', weight: 7 },
          { tile: '🏡', weight: 2 },
          { tile: '🌾', weight: 3 },
          { tile: '🏕', weight: 0.1 },
          { tile: '🛖', weight: 0.1 },
        ],
      },
      {
        source: '🌾',
        candidates: [
          { tile: '🌾', weight: 3 },
          { tile: '🌲', weight: 1 },
          { tile: '🌳', weight: 1 },
        ],
      },
      {
        source: ' ',
        candidates: [
          { tile: ' ', weight: 3 },
          { tile: '🌲', weight: 2 },
          { tile: '🌳', weight: 2 },
        ],
      },
      {
        source: '🛖',
        candidates: [
          { tile: '🌲', weight: 2 },
          { tile: '🌳', weight: 2 },
        ],
      },
      {
        source: '🏕',
        candidates: [
          { tile: '🌲', weight: 1 },
          { tile: '🌳', weight: 1 },
          { tile: '🌾', weight: 5 },
        ],
      },
      {
        source: '🌲',
        candidates: [
          { tile: '⛰', weight: 1 },
          { tile: '🌲', weight: 3 },
          { tile: '🌳', weight: 2 },
          // {tile: '🪵', weight: 2},
        ],
      },
      // {
      //     source: '🛖',
      //     candidates: [
      //         {tile: '🌲', weight: 3},
      //         {tile: '🌳', weight: 2},
      //     ]
      // },
      {
        source: '🏡',
        candidates: [
          { tile: '🏠', weight: 2 },
          { tile: '🏡', weight: 1 },
          { tile: '🌳', weight: 2 },
        ],
      },
      {
        source: '🏠',
        candidates: [
          { tile: '🏠', weight: 1 },
          { tile: '🏡', weight: 2 },
          { tile: '🌳', weight: 2 },
        ],
      },
      // {
      //     source: '🪵',
      //     candidates: [
      //         {tile: '🌲', weight: 2},
      //         {tile: '🌳', weight: 2},
      //     ]
      // },
      // {
      //     source: '🌊',
      //     candidates: [
      //         {tile: '🌊', weight: 3},
      //         {tile: '🏝', weight: 1},
      //         {tile: '🏖', weight: 1},
      //     ]
      // },
      // {
      //     source: '🏝',
      //     candidates: [
      //         {tile: '🌊', weight: 3},
      //         {tile: '🌴', weight: 1},
      //         {tile: '🏖', weight: 1},
      //     ]
      // },
      // {
      //     source: '🏖',
      //     candidates: [
      //         {tile: '🌊', weight: 3},
      //         {tile: '🌴', weight: 1},
      //         {tile: '🏝', weight: 1},
      //     ]
      // },
      // {
      //     source: '🌴',
      //     candidates: [
      //         {tile: '🏝', weight: 2},
      //         {tile: '🌴', weight: 1},
      //         {tile: '🏖', weight: 2},
      //     ]
      // },
    );
  }
}
