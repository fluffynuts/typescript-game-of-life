import { expect } from 'chai';
import { tick } from '../src/game_of_life';

if (process.env.CONTINUOUS_TESTING) {
  console.log('Test run started at: ', new Date());
}
/*
Game of life rules:
Populated cell:
  < 2 neighbors => dead
  > 3 neighbors => dead
Unpopulated cell:
  > 2 neighbors => alive
*/
describe('game_of_life', () => {
  const emptyBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  describe('tick', () => {
    it('should leave a barren wasteland as it was', () => {
      // Arrange
      const
        board = emptyBoard,
        expected = board;
      // Act
      const result = tick(board);
      // Assert
      expect(result).to.eql(board);
    });
    it('should always return copies', () => {
      // Arrange
      const
        board = emptyBoard,
        expected = board;
      // Act
      const result = tick(board);
      // Assert
      expect(result).not.to.equal(board);
      expect(result[0]).not.to.equal(board[0]);
      expect(result[1]).not.to.equal(board[1]);
      expect(result[2]).not.to.equal(board[2]);
    });
    const singleCellTestCases = [
      [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ],
      [
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      [
        [0, 0, 0],
        [0, 0, 1],
        [0, 0, 0]
      ]
    ];
    singleCellTestCases.forEach(board => {
      it('should kill the single cell with no neigbors', () => {
        // Arrange
        const expected = emptyBoard;
        // Act
        const result = tick(board);
        // Assert
        expect(result).to.eql(expected);
      });
    });

    const oneNeighborTestCases = [
      [
        [0, 0, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ],
      [
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 0]
      ]
    ];
    oneNeighborTestCases.forEach(board => {
      it('should kill the cell with only one neighbor', () => {
        // Arrange
        const expected = emptyBoard;
        // Act
        const result = tick(board);
        // Assert
        expect(result).to.eql(expected);
      });
    });

    const twoNeighborTestCasesWithCentralSurvivor = [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ]
    ];
    twoNeighborTestCasesWithCentralSurvivor.forEach(board => {
      it('should keep a cell alive if it has two neighbors', () => {
        // Arrange
        // Act
        const result = tick(board);
        // Assert
        expect(result[1][1]).to.equal(1);
      });
    });

    const threeNeighborTestCasesWithCentralSurvivor = [
      [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 0]
      ],
      [
        [1, 0, 0],
        [0, 1, 1],
        [1, 0, 0]
      ],
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
      ]
    ];
    threeNeighborTestCasesWithCentralSurvivor.forEach(board => {
      it('should keep a cell alive if it has three neigbors', () => {
        // Arrange
        // Act
        const result = tick(board);
        // Assert
        expect(result[1][1]).to.equal(1);
      });
    });

    it('should keep a corner cell alive if it has two neighbors v1', () => {
      // Arrange
      const
        board = [
          [1, 1, 0],
          [1, 0, 0],
          [0, 0, 0]
        ];
      // Act
      const result = tick(board);
      // Assert
      expect(result[0][0]).to.equal(1);
    });
    it('should keep a corner cell alive if it has two neighbors v2', () => {
      // Arrange
      const
        board = [
          [0, 1, 1],
          [0, 0, 1],
          [0, 0, 0]
        ];
      // Act
      const result = tick(board);
      // Assert
      expect(result[0][2]).to.equal(1);
    });

    it('should keep a corner cell alive if it has three neighbors v1', () => {
      // Arrange
      const
        board = [
          [0, 0, 0],
          [1, 1, 0],
          [1, 1, 0]
        ];
      // Act
      const result = tick(board);
      // Assert
      expect(result[2][0]).to.equal(1);
    });
    it('should keep a corner cell alive if it has three neighbors v2', () => {
      // Arrange
      const
        board = [
          [0, 1, 1],
          [0, 1, 1],
          [0, 0, 0]
        ];
      // Act
      const result = tick(board);
      // Assert
      expect(result[0][2]).to.equal(1);
    });

    const fourNeighborWithCentralDeathTestCases = [
      [
        [1, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      [
        [1, 1, 1],
        [0, 1, 1],
        [0, 0, 0]
      ],
      [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1]
      ],
    ];
    fourNeighborWithCentralDeathTestCases.forEach(board => {
      it('will kill the cell with four neighbors', () => {
        // Arrange
        // Act
        const result = tick(board);
        // Assert
        expect(result[1][1]).to.equal(0);
      });
    });
    const fiveNeighborWithCentralDeathTestCases = [
      [
        [1, 1, 1],
        [1, 1, 0],
        [0, 0, 1]
      ],
      [
        [1, 1, 1],
        [0, 1, 1],
        [1, 0, 0]
      ],
      [
        [1, 1, 1],
        [0, 1, 0],
        [1, 0, 1]
      ],
    ];
    fiveNeighborWithCentralDeathTestCases.forEach(board => {
      it('will kill the cell with five neighbors', () => {
        // Arrange
        // Act
        const result = tick(board);
        // Assert
        expect(result[1][1]).to.equal(0);
      });
    });

    const centralBirthTestCases = [
      [
        [1, 1, 1],
        [0, 0, 0],
        [0, 0, 0]
      ]
    ];
    centralBirthTestCases.forEach(board => {
      it('', () => {
        // Arrange
        // Act
        const result = tick(board);
        // Assert
        expect(result[1][1]).to.equal(1);
      });
    });

    it('should spawn at corner with two neighbors, v1', () => {
      // Arrange
      const board = [
        [0, 1, 0],
        [0, 1, 1],
        [1, 1, 1]
      ];
      // Act
      const result = tick(board);
      // Assert
      expect(result[0][2]).to.equal(1);
    });
    it('should spawn at corner with two neighbors, v1', () => {
      // Arrange
      const board = [
        [0, 1, 0],
        [0, 1, 1],
        [1, 1, 0]
      ];
      // Act
      const result = tick(board);
      // Assert
      expect(result[2][2]).to.equal(1);
    });

    describe('known patterns', () => {
      describe('blinker', () => {
        it('should go vertical after being flat', () => {
          // Arrange
          const
            board = [
              [0, 0, 0],
              [1, 1, 1],
              [0, 0, 0]
            ],
            expected = [
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0]
            ];
          // Act
          const result = tick(board);
          // Assert
          expect(result).to.eql(expected);
        });
      });
      it('should go flat after being vertical', () => {
        // Arrange
        const
          expected = [
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
          ],
          board = [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
          ];
        // Act
        const result = tick(board);
        // Assert
        expect(result).to.eql(expected);
      });
    });
    describe('block', () => {
      const blockTestCases = [
        [
          [0, 1, 1],
          [0, 1, 1],
          [0, 0, 0]
        ],
        [
          [1, 1, 0],
          [1, 1, 0],
          [0, 0, 0]
        ],
        [
          [0, 0, 0],
          [0, 1, 1],
          [0, 1, 1]
        ],
      ];
      blockTestCases.forEach(board => {
        it('should not change', () => {
          // Arrange
          // Act
          const result = tick(board);
          // Assert
          expect(result).to.eql(board);
        });
      });
    });
    describe('glider', () => {
      const steps = [
        [
          [ 0, 1, 0, 0 ],
          [ 0, 0, 1, 0 ],
          [ 1, 1, 1, 0 ],
          [ 0, 0, 0, 0 ]
        ],
        [
          [ 0, 0, 0, 0 ],
          [ 1, 0, 1, 0 ],
          [ 0, 1, 1, 0 ],
          [ 0, 1, 0, 0 ]
        ],
        [
          [ 0, 0, 0, 0 ],
          [ 0, 0, 1, 0 ],
          [ 1, 0, 1, 0 ],
          [ 0, 1, 1, 0 ]
        ],
      ];
      it('should progress through known steps', () => {
        // Arrange
        // Act
        for (let i = 0; i < steps.length - 1; i++) {
          const result = tick(steps[i]);
          expect(result).to.eql(steps[i + 1]);
        }
        // Assert
      });
    });
  });
});