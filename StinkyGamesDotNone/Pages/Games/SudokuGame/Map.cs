using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
namespace StinkyGamesDotNone
{
    /// <summary>
    /// Represents a Sudoku game map with nested grid class
    /// </summary>
    public class Map
    {
        public Grid[,] Grids { get; private set; }

        
        public static int _singleTonCount = 0;

        public Map()
        {
            ///<summary>
            /// Implementing SingleTon
            ///</summary>
            if (++_singleTonCount > 1)
                throw new Exception("You can't have more " +
                                    "than one instance of Map Class");
            int gridAmount = 9;

            if ((int)Math.Sqrt(gridAmount) != Math.Sqrt(gridAmount))
                throw new Exception("A map cannot contain");

            Grids = Grid.CreateGrids();
        }

        public void RestartGrids()
        {
            Grids = Grid.CreateGrids();
        }
        //public void PrintMap()
        //{
        //    for (int gridRow = 0; gridRow < Grid._gridsAcross; gridRow++)
        //    {
        //        for (int tileRow = 0; tileRow < Grid._tilesAcross; tileRow++) // tile row
        //        {
        //            for (int gridCol = 0; gridCol < Grid._gridsAcross; gridCol++)
        //            {
        //                for (int tileCol = 0; tileCol < Grid._tilesAcross; tileCol++)
        //                {
        //                    int? tile = Grids[gridRow, gridCol].Tiles[tileRow, tileCol];
        //                    Console.Write(tile is null ? "-" : tile.ToString());
        //                    Console.Write(tileCol + 1 == Grid._tilesAcross ? "|" : "");
        //                }
        //                Console.Write(gridCol + 1 == Grid._gridsAcross ? "\n" : "");
        //            }
        //        }
        //        Console.WriteLine("------------");
        //    }
        //}
        public class Grid
        {
            private static Random random = new Random();

            private static Grid[,] grids;
            internal static readonly int _gridAmount = 9;
            internal static readonly int _gridsAcross = (int)Math.Sqrt(_gridAmount);

            internal static readonly int _tileAmount = 9;
            internal static readonly int _tilesAcross = (int)Math.Sqrt(_tileAmount);

            private int?[,] _tiles;
            //public int?[,] Tiles
            //{
            //    get { return _tiles; }
            //}

            public object GetTile(int row, int col)
            {
                object tile = _tiles[row, col];
                return tile is int? ? tile : 'X';
            }
            private Grid()
            {
                //DEBUG LOG
                Console.WriteLine("Instantiating Grid Class");
                _tiles = new int?[_tilesAcross,_tilesAcross];
            }
            /// <summary>
            /// The only way to create grids outside of its class
            /// </summary>
            /// <returns>
            /// An array of grid objects with non-repeating tile numbers: horizontally and vertically
            /// </returns>
            public static Grid[,] CreateGrids()
            {
                //DEBUG LOG
                Console.WriteLine("Creating Grid...");
                grids = new Grid[_gridsAcross, _gridsAcross];
                for (int gridRow = 0; gridRow < _gridsAcross; gridRow++)
                {
                    for (int gridCol = 0; gridCol < _gridsAcross; gridCol++)
                    {
                        grids[gridRow, gridCol] = new Grid(); 
                    }
                }
                int count = 0;

                //DEBUG LOG
                Console.WriteLine("Start filling the Grids");
                // checking for uniqueness of position of a tile in all directions and inside a grid
                int tileRow = -1;
                int tileCol = -1; // is -1 because these had to be assigned to something, I chose -1

                List<string> allWayTilesToSkip = new List<string>();
                
                //bool AllWayTileCheck()
                //{
                //    //allWayTilesToSkip[0];
                //}
                for (int gridRow = 0; gridRow < _tilesAcross; gridRow++)
                {
                    for (int gridCol = 0; gridCol < _tilesAcross; gridCol++)
                    {
                        //DEBUG LOG
                        Console.WriteLine($"\nCreating {count}th grid----------------");
                        List<string> tilesToSkip = new List<string>();
                        List<int?> numbersToSkip = new List<int?>();

                        int tilesToFill = random.Next(5);
                        //DEBUG LOG
                        Console.WriteLine($"Tile Amount: {tilesToFill}");

                        for (int pos = 0; pos < tilesToFill; pos++) // variable in for loop determines how many positions will be filled
                        {
                            //DEBUG LOG
                            Console.WriteLine($"\nFilling {pos + 1}th position");

                            string checkUniqueTile = null;
                            int? number = null;
                            try // try to assign non-repeating number
                            {
                                //bool repeatGridCheck;
                                //do // vertically & horizontally
                                //{
                                //    repeatGridCheck = false;

                                    do // inside one grid
                                    {
                                        tileRow = random.Next(_tilesAcross);
                                        tileCol = random.Next(_tilesAcross);
                                        //DEBUG LOG
                                        checkUniqueTile = $"{tileRow},{tileCol}";
                                        Console.WriteLine($"choosing position {checkUniqueTile}");

                                        number = random.Next(1, _tileAmount + 1);
                                        //DEBUG LOG
                                        Console.WriteLine($"choosing number {number}");
                                    } while (tilesToSkip.Contains(checkUniqueTile) && numbersToSkip.Contains(number));
                                    //int gridCheck = 0;
                                    //switch (gridRow)
                                    //{
                                    //    case 2:
                                    //        gridCheck = 1;
                                    //        goto case 1;
                                    //    case 1:
                                    //        for (; gridCheck >= 0; gridCheck--)
                                    //        {
                                    //            //int? currentTile = grids[gridRow, gridCol]._tiles[tileRow, tileCol];
                                    //            int? tilesToCheck = grids[gridRow - 1, gridCol]._tiles[tileRow, tileCol];
                                    //            if (number == tilesToCheck)
                                    //            {
                                    //                Console.WriteLine($"Avoid vertical repetition with:" +
                                    //                    $"{gridCheck * 3 + gridCol}/{count}th grid, at position [{gridRow},{gridCol}], number: {number}");
                                    //            repeatGridCheck = true;
                                    //                break;
                                    //            }
                                    //        }
                                    //        break;
                                    //}
                                //} while (repeatGridCheck);
                            }
                            catch (StackOverflowException ex)
                            {
                                Console.WriteLine("Stack overflow when choosing position " + ex);
                                CreateGrids(); // Restart the method
                            }
                            finally
                            {
                                //DEBUG LOG
                                Console.WriteLine($"chose position {checkUniqueTile}");
                                tilesToSkip.Add(checkUniqueTile);

                                //DEBUG LOG
                                Console.WriteLine($"chose number {number}");
                                numbersToSkip.Add(number);
                                grids[gridRow, gridCol]._tiles[tileRow, tileCol] = number;

                            }
                            Console.WriteLine($"Added {pos + 1}th position; number {number} at [{tileRow},{tileCol}]");
                        }
                    }
                    count++;
                }
                return grids;
            }
        }
    }
}
// 1 2 3
// 4 5 6   row check => x -+ 1
// 7 8 9   col check => x -+ 3