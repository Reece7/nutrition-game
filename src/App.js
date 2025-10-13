import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

// Define food items with their properties
const foodItems = [
  { name: 'carrot', icon: '🥕', color: 0xff9900, fact: "Carrots help your eyesight with Vitamin A." },
  { name: 'apple', icon: '🍎', color: 0xff0000, fact: "Apples keep you healthy with fiber and Vitamin C." },
  { name: 'milk', icon: '🥛', color: 0xffffff, fact: "Milk has calcium that builds strong bones." },
  { name: 'fish', icon: '🐟', color: 0x88ccee, fact: "Fish is brain food with omega-3 fatty acids." },
  { name: 'egg', icon: '🥚', color: 0xffffcc, fact: "Eggs give you protein to grow muscles." },
  { name: 'rice', icon: '🍚', color: 0xffffdd, fact: "Rice gives you energy with carbohydrates." }
];

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.grid = [];
    this.selectedTile = null;
    this.isSwapping = false;
    this.isProcessing = false;
  }

  preload() {
    // Nothing to preload for this prototype
  }

  create() {
    // Create cartoon-style background
    this.createBackground();
    
    // Create title
    this.add.text(200, 30, 'Nutrition Match', { 
      fontSize: '32px', 
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Create score text
    this.score = 0;
    this.scoreText = this.add.text(16, 80, 'Score: 0', { 
      fontSize: '24px', 
      fill: '#ffffff',
      backgroundColor: '#4a90e2',
      padding: { x: 15, y: 8 },
      stroke: '#000000',
      strokeThickness: 3
    });

    // Create game grid
    this.createGrid();
  }

  createBackground() {
    // Sky blue background
    this.add.rectangle(200, 300, 400, 600, 0x87CEEB);
    
    // Sun
    const sun = this.add.circle(350, 80, 40, 0xffdd00);
    sun.setStrokeStyle(2, 0xffaa00);
    
    // Sun rays
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x1 = 350 + Math.cos(angle) * 45;
      const y1 = 80 + Math.sin(angle) * 45;
      const x2 = 350 + Math.cos(angle) * 60;
      const y2 = 80 + Math.sin(angle) * 60;
      this.add.line(0, 0, x1, y1, x2, y2, 0xffdd00).setLineWidth(3).setOrigin(0);
    }
    
    // Clouds
    this.add.ellipse(100, 70, 80, 40, 0xffffff);
    this.add.ellipse(90, 60, 60, 30, 0xffffff);
    this.add.ellipse(110, 60, 60, 30, 0xffffff);
    
    this.add.ellipse(250, 100, 100, 50, 0xffffff);
    this.add.ellipse(230, 85, 70, 35, 0xffffff);
    this.add.ellipse(270, 85, 70, 35, 0xffffff);
    
    // Grass
    const grass = this.add.rectangle(200, 580, 400, 40, 0x7CFC00);
    grass.setStrokeStyle(2, 0x5eb300);
    
    // Simple cartoon kids
    // Kid 1
    this.add.circle(80, 550, 15, 0xffccaa); // Head
    this.add.rectangle(80, 575, 20, 30, 0xff6666); // Body
    this.add.rectangle(70, 565, 5, 20, 0xffccaa); // Left arm
    this.add.rectangle(90, 565, 5, 20, 0xffccaa); // Right arm
    this.add.rectangle(75, 595, 8, 25, 0x0000ff); // Left leg
    this.add.rectangle(85, 595, 8, 25, 0x0000ff); // Right leg
    // Kid 1 face
    this.add.circle(75, 545, 2, 0x000000); // Left eye
    this.add.circle(85, 545, 2, 0x000000); // Right eye
    this.add.arc(80, 555, 5, 0, Math.PI, false, 0x000000); // Smile
    
    // Kid 2
    this.add.circle(320, 540, 18, 0xdda0dd); // Head
    this.add.rectangle(320, 570, 25, 35, 0x66ccff); // Body
    this.add.rectangle(305, 560, 6, 25, 0xdda0dd); // Left arm
    this.add.rectangle(335, 560, 6, 25, 0xdda0dd); // Right arm
    this.add.rectangle(312, 595, 9, 30, 0x339933); // Left leg
    this.add.rectangle(328, 595, 9, 30, 0x339933); // Right leg
    // Kid 2 face
    this.add.circle(313, 535, 2, 0x000000); // Left eye
    this.add.circle(327, 535, 2, 0x000000); // Right eye
    this.add.arc(320, 545, 6, 0, Math.PI, false, 0x000000); // Smile
  }

  createGrid() {
    const gridSize = 5;
    const tileSize = 60;
    const offsetX = (400 - (gridSize * tileSize)) / 2;
    const offsetY = 180;
    
    // Clear existing grid
    this.grid = [];
    
    for (let y = 0; y < gridSize; y++) {
      this.grid[y] = [];
      for (let x = 0; x < gridSize; x++) {
        const randomItem = foodItems[Math.floor(Math.random() * foodItems.length)];
        
        // Create a container for the tile
        const tileContainer = this.add.container(
          offsetX + x * tileSize + tileSize / 2,
          offsetY + y * tileSize + tileSize / 2
        );
        
        // Create background for the tile (rounded rectangle)
        const tileBg = this.add.rectangle(0, 0, tileSize - 4, tileSize - 4, randomItem.color);
        tileBg.setStrokeStyle(3, 0x000000);
        tileBg.setOrigin(0.5);
        
        // Add emoji icon
        const icon = this.add.text(0, 0, randomItem.icon, {
          fontSize: '36px'
        }).setOrigin(0.5);
        
        // Add objects to container
        tileContainer.add([tileBg, icon]);
        
        // Make it interactive
        tileContainer.setInteractive(new Phaser.Geom.Rectangle(-tileSize/2, -tileSize/2, tileSize, tileSize), Phaser.Geom.Rectangle.Contains);
        
        // Store position and item data
        tileContainer.gridX = x;
        tileContainer.gridY = y;
        tileContainer.itemData = randomItem;
        tileContainer.bg = tileBg;
        
        // Add click event
        tileContainer.on('pointerdown', () => {
          this.handleTileClick(tileContainer);
        });
        
        // Store in grid
        this.grid[y][x] = tileContainer;
      }
    }
    
    // Ensure no initial matches
    this.removeInitialMatches();
  }

  handleTileClick(tile) {
    // Don't allow interaction during animations or if already processing
    if (this.isSwapping || this.isProcessing) return;
    
    // If no tile is selected yet
    if (!this.selectedTile) {
      this.selectedTile = tile;
      // Highlight selected tile with a yellow border
      tile.bg.setStrokeStyle(5, 0xffff00);
      return;
    }
    
    // If clicking the same tile, deselect it
    if (this.selectedTile === tile) {
      tile.bg.setStrokeStyle(3, 0x000000);
      this.selectedTile = null;
      return;
    }
    
    // Check if tiles are adjacent
    const dx = Math.abs(this.selectedTile.gridX - tile.gridX);
    const dy = Math.abs(this.selectedTile.gridY - tile.gridY);
    const isAdjacent = (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    
    if (isAdjacent) {
      // Store references to the tiles
      const tile1 = this.selectedTile;
      const tile2 = tile;
      
      // Reset selection immediately
      tile1.bg.setStrokeStyle(3, 0x000000);
      this.selectedTile = null;
      
      // Swap the tiles
      this.swapTiles(tile1, tile2);
    } else {
      // Reset border of previously selected tile
      this.selectedTile.bg.setStrokeStyle(3, 0x000000);
      
      // Select new tile
      this.selectedTile = tile;
      tile.bg.setStrokeStyle(5, 0xffff00);
    }
  }

  swapTiles(tile1, tile2) {
    this.isSwapping = true;
    
    // Reset borders
    tile1.bg.setStrokeStyle(3, 0x000000);
    tile2.bg.setStrokeStyle(3, 0x000000);
    
    // Store original positions for potential swap back
    const originalPos1 = { x: tile1.gridX, y: tile1.gridY };
    const originalPos2 = { x: tile2.gridX, y: tile2.gridY };
    
    // Temporarily disable interactivity during swap
    tile1.disableInteractive();
    tile2.disableInteractive();
    
    // Calculate new positions
    const tileSize = 60;
    const offsetX = (400 - (5 * tileSize)) / 2;
    const offsetY = 180;
    
    const newX1 = offsetX + tile2.gridX * tileSize + tileSize / 2;
    const newY1 = offsetY + tile2.gridY * tileSize + tileSize / 2;
    
    const newX2 = offsetX + tile1.gridX * tileSize + tileSize / 2;
    const newY2 = offsetY + tile1.gridY * tileSize + tileSize / 2;
    
    // Update grid positions immediately before animation
    this.swapGridPositions(tile1, tile2);
    
    // Animate the swap
    this.tweens.add({
      targets: tile1,
      x: newX1,
      y: newY1,
      duration: 300,
      onComplete: () => {
        // Re-enable interactivity after animation
        tile1.setInteractive();
        tile2.setInteractive();
        
        // Check for matches after swap
        const matches = this.findAllMatches();
        
        if (matches.length > 0) {
          this.processMatches(matches);
        } else {
          // If no matches, swap back
          this.swapBack(tile1, tile2, originalPos1, originalPos2);
        }
      }
    });
    
    this.tweens.add({
      targets: tile2,
      x: newX2,
      y: newY2,
      duration: 300
    });
  }

  swapBack(tile1, tile2, originalPos1, originalPos2) {
    // Disable interactivity during swap back
    tile1.disableInteractive();
    tile2.disableInteractive();
    
    // Calculate original positions
    const tileSize = 60;
    const offsetX = (400 - (5 * tileSize)) / 2;
    const offsetY = 180;
    
    const originalX1 = offsetX + originalPos1.x * tileSize + tileSize / 2;
    const originalY1 = offsetY + originalPos1.y * tileSize + tileSize / 2;
    
    const originalX2 = offsetX + originalPos2.x * tileSize + tileSize / 2;
    const originalY2 = offsetY + originalPos2.y * tileSize + tileSize / 2;
    
    // Animate swap back
    const tween1 = this.tweens.add({
      targets: tile1,
      x: originalX1,
      y: originalY1,
      duration: 300
    });
    
    const tween2 = this.tweens.add({
      targets: tile2,
      x: originalX2,
      y: originalY2,
      duration: 300,
      onComplete: () => {
        // Update grid positions after animation completes
        this.swapGridPositions(tile1, tile2);
        
        // Re-enable interactivity
        tile1.setInteractive();
        tile2.setInteractive();
        
        // Reset flags
        this.isSwapping = false;
        this.selectedTile = null;
      }
    });
  }

  swapGridPositions(tile1, tile2) {
    // Swap positions in grid array
    const temp = this.grid[tile1.gridY][tile1.gridX];
    this.grid[tile1.gridY][tile1.gridX] = this.grid[tile2.gridY][tile2.gridX];
    this.grid[tile2.gridY][tile2.gridX] = temp;
    
    // Update tile position properties
    const tempX = tile1.gridX;
    const tempY = tile1.gridY;
    
    tile1.gridX = tile2.gridX;
    tile1.gridY = tile2.gridY;
    
    tile2.gridX = tempX;
    tile2.gridY = tempY;
  }

  findAllMatches() {
    let matches = [];
    
    // Check horizontal matches
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 3; x++) {
        const tile1 = this.grid[y][x];
        // Skip if tile1 is null
        if (!tile1) continue;
        
        const tile2 = this.grid[y][x + 1];
        // Skip if tile2 is null
        if (!tile2) continue;
        
        const tile3 = this.grid[y][x + 2];
        // Skip if tile3 is null
        if (!tile3) continue;
        
        if (tile1.itemData.name === tile2.itemData.name && 
            tile2.itemData.name === tile3.itemData.name) {
          // Found a match
          let matchTiles = [tile1, tile2, tile3];
          
          // Check for longer matches
          for (let i = x + 3; i < 5; i++) {
            const nextTile = this.grid[y][i];
            // Skip if nextTile is null
            if (!nextTile) break;
            
            if (nextTile.itemData.name === tile1.itemData.name) {
              matchTiles.push(nextTile);
            } else {
              break;
            }
          }
          
          // Add to matches (avoid duplicates)
          matchTiles.forEach(tile => {
            if (!matches.includes(tile)) {
              matches.push(tile);
            }
          });
        }
      }
    }
    
    // Check vertical matches
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 3; y++) {
        const tile1 = this.grid[y][x];
        // Skip if tile1 is null
        if (!tile1) continue;
        
        const tile2 = this.grid[y + 1][x];
        // Skip if tile2 is null
        if (!tile2) continue;
        
        const tile3 = this.grid[y + 2][x];
        // Skip if tile3 is null
        if (!tile3) continue;
        
        if (tile1.itemData.name === tile2.itemData.name && 
            tile2.itemData.name === tile3.itemData.name) {
          // Found a match
          let matchTiles = [tile1, tile2, tile3];
          
          // Check for longer matches
          for (let i = y + 3; i < 5; i++) {
            const nextTile = this.grid[i][x];
            // Skip if nextTile is null
            if (!nextTile) break;
            
            if (nextTile.itemData.name === tile1.itemData.name) {
              matchTiles.push(nextTile);
            } else {
              break;
            }
          }
          
          // Add to matches (avoid duplicates)
          matchTiles.forEach(tile => {
            if (!matches.includes(tile)) {
              matches.push(tile);
            }
          });
        }
      }
    }
    
    return matches;
  }

  processMatches(matches) {
    this.isProcessing = true;

    // Update score
    this.score += matches.length * 10;
    this.scoreText.setText('Score: ' + this.score);

    // Show nutrition fact for one of the matched tiles with glass effect
    if (matches.length > 0) {
      const glassBg = this.add.rectangle(200, 300, 350, 150, 0xffffff);
      glassBg.setAlpha(0.85);
      glassBg.setStrokeStyle(2, 0x000000);

      const shadow = this.add.rectangle(205, 305, 350, 150, 0x000000);
      shadow.setAlpha(0.3);
      shadow.setDepth(1000);

      glassBg.setDepth(1001);

      const factText = this.add.text(200, 300, matches[0].itemData.fact, {
        fontSize: '20px',
        fill: '#000000',
        wordWrap: { width: 300 },
        align: 'center',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      factText.setDepth(1002);

      const textBg = this.add.rectangle(200, 300, 310, 110, 0xffffff, 0);
      textBg.setStrokeStyle(1, 0x000000);
      textBg.setDepth(1001);

      this.time.delayedCall(2500, () => {
        shadow.destroy();
        glassBg.destroy();
        factText.destroy();
        textBg.destroy();
      });
    }

    matches.forEach(tile => {
      this.grid[tile.gridY][tile.gridX] = null;

      this.tweens.add({
        targets: tile,
        scale: 0,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
          tile.destroy();
        }
      });
    });

    this.time.delayedCall(350, () => {
      this.dropTiles();
      this.time.delayedCall(450, () => {
        this.fillEmptySpaces();
        this.time.delayedCall(600, () => {
          const newMatches = this.findAllMatches();
          if (newMatches.length > 0) {
            this.processMatches(newMatches);
          } else {
            this.isSwapping = false;
            this.isProcessing = false;
          }
        });
      });
    });
  }

  dropTiles() {
    const tileSize = 60;
    const offsetX = (400 - (5 * tileSize)) / 2;
    const offsetY = 180;

    for (let x = 0; x < 5; x++) {
      const tilesInColumn = [];
      for (let y = 4; y >= 0; y--) {
        if (this.grid[y] && this.grid[y][x]) {
          tilesInColumn.push(this.grid[y][x]);
          this.grid[y][x] = null;
        }
      }

      for (let i = 0; i < tilesInColumn.length; i++) {
        const tile = tilesInColumn[i];
        const targetY = 4 - i;

        if (!this.grid[targetY]) this.grid[targetY] = [];
        this.grid[targetY][x] = tile;
        tile.gridY = targetY;
        tile.gridX = x;

        const targetYPos = offsetY + targetY * tileSize + tileSize / 2;

        tile.disableInteractive();

        this.tweens.add({
          targets: tile,
          y: targetYPos,
          duration: 400,
          ease: 'Bounce.easeOut',
          onComplete: () => {
            tile.setInteractive();
          }
        });
      }
    }
  }

  fillEmptySpaces() {
    const tileSize = 60;
    const offsetX = (400 - (5 * tileSize)) / 2;
    const offsetY = 180;

    for (let y = 0; y < 5; y++) {
      if (!this.grid[y]) this.grid[y] = [];

      for (let x = 0; x < 5; x++) {
        if (!this.grid[y][x]) {
          const randomItem = foodItems[Math.floor(Math.random() * foodItems.length)];

          const startY = offsetY - (5 - y) * tileSize - 60;

          const tileContainer = this.add.container(
            offsetX + x * tileSize + tileSize / 2,
            startY
          );

          const tileBg = this.add.rectangle(0, 0, tileSize - 4, tileSize - 4, randomItem.color);
          tileBg.setStrokeStyle(3, 0x000000);
          tileBg.setOrigin(0.5);

          const icon = this.add.text(0, 0, randomItem.icon, {
            fontSize: '36px'
          }).setOrigin(0.5);

          tileContainer.add([tileBg, icon]);

          tileContainer.setInteractive(
            new Phaser.Geom.Rectangle(-tileSize/2, -tileSize/2, tileSize, tileSize),
            Phaser.Geom.Rectangle.Contains
          );

          tileContainer.gridX = x;
          tileContainer.gridY = y;
          tileContainer.itemData = randomItem;
          tileContainer.bg = tileBg;

          tileContainer.on('pointerdown', () => {
            this.handleTileClick(tileContainer);
          });

          this.grid[y][x] = tileContainer;

          const targetY = offsetY + y * tileSize + tileSize / 2;

          tileContainer.disableInteractive();

          this.tweens.add({
            targets: tileContainer,
            y: targetY,
            duration: 500,
            ease: 'Bounce.easeOut',
            onComplete: () => {
              tileContainer.setInteractive();
            }
          });
        }
      }
    }
  }
  
  removeInitialMatches() {
    let matches = this.findAllMatches();
    
    while (matches.length > 0) {
      // For each match, change one of the tiles to a different item
      matches.forEach(match => {
        // Get a different food item
        let newItem;
        do {
          newItem = foodItems[Math.floor(Math.random() * foodItems.length)];
        } while (newItem.name === match.itemData.name);
        
        // Update the tile's item data
        match.itemData = newItem;
        
        // Update the tile's visual appearance
        match.removeAll(true); // Remove all children
        
        // Recreate the tile with the new item
        const tileSize = 60;
        const tileBg = this.add.rectangle(0, 0, tileSize - 4, tileSize - 4, newItem.color);
        tileBg.setStrokeStyle(3, 0x000000);
        tileBg.setOrigin(0.5);
        
        const icon = this.add.text(0, 0, newItem.icon, {
          fontSize: '36px'
        }).setOrigin(0.5);
        
        match.add([tileBg, icon]);
        match.bg = tileBg;
      });
      
      // Check again for matches
      matches = this.findAllMatches();
    }
  }
}

function App() {
  const gameRef = useRef(null);

  useEffect(() => {
    // Only initialize the game if it hasn't been initialized yet
    if (!gameRef.current) {
      const config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 400,
        height: 600,
        backgroundColor: '#87CEEB', // Sky blue background
        scene: [GameScene],
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        }
      };
      
      const game = new Phaser.Game(config);
      gameRef.current = game;
    }

    // Clean up Phaser game when component unmounts
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#87CEEB',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    }}>
      <div id="game"></div>
    </div>
  );
}

export default App;