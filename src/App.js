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

// Level configurations
const levelConfig = [
  {
    level: 1,
    gridSize: 5,
    targetScore: 250,
    maxMoves: 20,
    objectives: [
      { type: 'score', target: 100, description: 'Score 100 points' }
    ]
  },
  {
    level: 2,
    gridSize: 6,
    targetScore: 500,
    maxMoves: 25,
    objectives: [
      { type: 'collect', item: 'carrot', target: 5, description: 'Collect 5 carrots' },
      { type: 'score', target: 200, description: 'Score 200 points' }
    ]
  },
  {
    level: 3,
    gridSize: 6,
    targetScore: 750,
    maxMoves: 30,
    objectives: [
      { type: 'collect', item: 'apple', target: 5, description: 'Collect 5 apples' },
      { type: 'collect', item: 'fish', target: 5, description: 'Collect 5 fish' },
      { type: 'score', target: 350, description: 'Score 350 points' }
    ]
  }
  // Add more levels as needed
];

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.grid = [];
    this.selectedTile = null;
    this.isSwapping = false;
    this.isProcessing = false;
    this.gridSize = 6;
    this.tileSize = 50;
    this.isShowingFact = false;

    // New properties for level system
    this.currentLevel = 0;
    this.movesLeft = 0;
    this.objectives = [];
    this.collectedItems = {};
    this.stars = 0;
    this.levelComplete = false;
  }

  preload() {
    // Nothing to preload for this prototype
  }

  initLevel(levelIndex) {
  // Clear any existing game objects
    this.children.each(child => {
      if (child !== this.levelText && 
         child !== this.movesText && 
         child !== this.scoreText) {
         child.destroy();
      }
    });

    // Reset level state
    this.grid = [];
    this.selectedTile = null;
    this.isSwapping = false;
    this.isProcessing = false;
    this.levelComplete = false;

    const level = levelConfig[levelIndex];
    if (!level) {
      // No more levels - game completed!
     this.showGameComplete();
      return;
    }

    this.currentLevel = levelIndex;
    this.gridSize = level.gridSize;
    this.movesLeft = level.maxMoves;
    this.objectives = [...level.objectives];
    this.collectedItems = {};
    this.levelComplete = false;
  
    // Reset the grid
    this.grid = [];
  
    // Clear existing UI
    if (this.objectivesContainer) {
        this.objectivesContainer.destroy();
        this.objectivesContainer = null;
    }
  
    // Recreate background
    this.createBackground();

    // Update UI
    this.updateUI();
  
    // Create new grid
    this.createGrid();
  }

  // updateUI() {
  //   // Update level display
  //   if (!this.levelText) {
  //     this.levelText = this.add.text(20, 40, `Level: ${this.currentLevel + 1}`, 
  //       { 
  //         fontSize: '20px', 
  //         fill: '#fff', 
  //         backgroundColor: 'rgba(0,0,0,0.7)', 
  //         padding: { x: 10, y: 5 }
  //       })
  //       .setDepth(100);
  //   } else {
  //     this.levelText.setText(`Level: ${this.currentLevel + 1}`);
  //   }
    
  //   // Update moves display
  //   if (!this.movesText) {
  //     this.movesText = this.add.text(150, 40, `Moves: ${this.movesLeft}`, 
  //       { 
  //         fontSize: '20px', 
  //         fill: '#fff', 
  //         backgroundColor: 'rgba(0,0,0,0.7)', 
  //         padding: { x: 10, y: 5 }
  //       })
  //       .setDepth(100);
  //   } else {
  //     this.movesText.setText(`Moves: ${this.movesLeft}`);
  //   }
    
  //   // Update score display
  //   if (!this.scoreText) {
  //     this.scoreText = this.add.text(300, 40, `Score: ${this.score}`, 
  //       { 
  //         fontSize: '20px', 
  //         fill: '#fff', 
  //         backgroundColor: 'rgba(0,0,0,0.7)', 
  //         padding: { x: 10, y: 5 }
  //       })
  //       .setDepth(100);
  //   } else {
  //     this.scoreText.setText(`Score: ${this.score}`);
  //   }
  
  //   // Update objectives display
  //   if (this.objectivesContainer) {
  //     this.objectivesContainer.destroy();
  //   }
    
  //   // Calculate container height based on number of objectives
  //   const containerHeight = Math.max(80, this.objectives.length * 30 + 40);
    
  //   // Create objectives container with proper depth
  //   this.objectivesContainer = this.add.container(20, 80).setDepth(90);
    
  //   // Add semi-transparent background
  //   const bg = this.add.rectangle(
  //     0, 
  //     0, 
  //     360, 
  //     containerHeight, 
  //     0xffffff, 
  //     0.9
  //   )
  //   .setOrigin(0)
  //   .setStrokeStyle(2, 0x000000);
    
  //   // Add shadow for depth
  //   const shadow = this.add.rectangle(
  //     5, 
  //     5, 
  //     360, 
  //     containerHeight, 
  //     0x000000, 
  //     0.2
  //   )
  //   .setOrigin(0);
    
  //   this.objectivesContainer.add([shadow, bg]);
    
  //   // Add title with background
  //   const titleBg = this.add.rectangle(
  //     0, 
  //     0, 
  //     360, 
  //     30, 
  //     0x4a90e2, 
  //     0.8
  //   )
  //   .setOrigin(0);
    
  //   const title = this.add.text(
  //     10, 
  //     5, 
  //     'OBJECTIVES', 
  //     { 
  //       fontSize: '18px', 
  //       fill: '#fff', 
  //       fontStyle: 'bold',
  //       shadow: {
  //         offsetX: 1,
  //         offsetY: 1,
  //         color: '#000',
  //         blur: 2,
  //         stroke: true,
  //         fill: true
  //       }
  //     }
  //   );
    
  //   this.objectivesContainer.add([titleBg, title]);
    
  //   // Add objectives with proper spacing
  //   this.objectives.forEach((obj, index) => {
  //     const yPos = index * 30 + 35;
  //     let text = obj.description;
  //     let completed = false;
      
  //     if (obj.type === 'collect') {
  //       const current = this.collectedItems[obj.item] || 0;
  //       text = `${obj.description} (${current}/${obj.target})`;
  //       completed = current >= obj.target;
  //     } else if (obj.type === 'score') {
  //       text = `Score ${obj.target} points (${this.score}/${obj.target})`;
  //       completed = this.score >= obj.target;
  //     }
      
  //     // Add checkmark for completed objectives
  //     const checkmark = this.add.text(
  //       10, 
  //       yPos, 
  //       completed ? '✓ ' : '○ ', 
  //       { 
  //         fontSize: '16px', 
  //         fill: completed ? '#00aa00' : '#888888'
  //       }
  //     );
      
  //     const objText = this.add.text(
  //       30, 
  //       yPos, 
  //       text, 
  //       { 
  //         fontSize: '16px', 
  //         fill: completed ? '#00aa00' : '#000000',
  //         fontStyle: completed ? 'bold' : 'normal'
  //       }
  //     );
      
  //     // Add progress bar for collect objectives
  //     if (obj.type === 'collect') {
  //       const current = this.collectedItems[obj.item] || 0;
  //       const progress = Math.min(1, current / obj.target);
  //       const progressBar = this.add.rectangle(
  //         30,
  //         yPos + 15,
  //         300 * progress,
  //         5,
  //         completed ? '#00aa00' : '#4a90e2'
  //       )
  //       .setOrigin(0, 0.5);
      
  //       const progressBg = this.add.rectangle(
  //         30,
  //         yPos + 15,
  //         300,
  //         5,
  //         0xdddddd
  //       )
  //       .setOrigin(0, 0.5)
  //       .setDepth(-1);
        
  //       this.objectivesContainer.add([progressBg, progressBar]);
  //     }
      
  //     this.objectivesContainer.add([checkmark, objText]);
  //   });
  
  //   // Add rounded corners to the container
  //   const mask = this.make.graphics();
  //   mask.fillRoundedRect(0, 0, 360, containerHeight, 10);
  //   const maskObj = mask.createGeometryMask();
  //   this.objectivesContainer.setMask(maskObj);
    
  //   // Make sure tiles are above the objectives box
  //   this.children.bringToTop(this.objectivesContainer);
  // }

  updateUI() {
    // Get the screen dimensions
    const { width, height } = this.scale;
    const isMobile = width < 768; // Check if mobile device
  
    // Update level display
    if (!this.levelText) {
      this.levelText = this.add.text(
        isMobile ? 10 : 20, 
        isMobile ? 10 : 40, 
        `Level: ${this.currentLevel + 1}`, 
        { 
          fontSize: isMobile ? '16px' : '20px', 
          fill: '#fff', 
          backgroundColor: 'rgba(0,0,0,0.7)', 
          padding: { x: 8, y: 4 }
        }
      ).setDepth(100);
    } else {
      this.levelText.setText(`Level: ${this.currentLevel + 1}`);
    }
    
    // Update moves display
    if (!this.movesText) {
      this.movesText = this.add.text(
        isMobile ? 110 : 150, 
        isMobile ? 10 : 40, 
        `Moves: ${this.movesLeft}`, 
        { 
          fontSize: isMobile ? '16px' : '20px', 
          fill: '#fff', 
          backgroundColor: 'rgba(0,0,0,0.7)', 
          padding: { x: 8, y: 4 }
        }
      ).setDepth(100);
    } else {
      this.movesText.setText(`Moves: ${this.movesLeft}`);
    }
    
    // Update score display
    if (!this.scoreText) {
      this.scoreText = this.add.text(
        isMobile ? 220 : 300, 
        isMobile ? 10 : 40, 
        `Score: ${this.score}`, 
        { 
          fontSize: isMobile ? '16px' : '20px', 
          fill: '#fff', 
          backgroundColor: 'rgba(0,0,0,0.7)', 
          padding: { x: 8, y: 4 }
        }
      ).setDepth(100);
    } else {
      this.scoreText.setText(`Score: ${this.score}`);
    }
    
    // Update objectives display
    if (this.objectivesContainer) {
      this.objectivesContainer.destroy();
    }
    
    // Calculate container dimensions based on screen size
    const containerWidth = isMobile ? width - 20 : 360;
    const containerX = isMobile ? 10 : 20;
    const containerY = isMobile ? 40 : 80;
    const itemSpacing = isMobile ? 25 : 30;
    const containerHeight = Math.max(80, this.objectives.length * itemSpacing + 40);
    
    // Create objectives container with proper depth
    this.objectivesContainer = this.add.container(containerX, containerY).setDepth(90);
    
    // Add semi-transparent background
    const bg = this.add.rectangle(
      0, 
      0, 
      containerWidth, 
      containerHeight, 
      0x000000, 
      0.7
    )
    .setOrigin(0)
    .setStrokeStyle(2, 0x4a90e2);
    
    this.objectivesContainer.add(bg);
    
    // Add title with background
    const titleBg = this.add.rectangle(
      0, 
      0, 
      containerWidth, 
      30, 
      0x4a90e2, 
      1
    ).setOrigin(0);
    
    const title = this.add.text(
      10, 
      5, 
      'OBJECTIVES', 
      { 
        fontSize: isMobile ? '16px' : '18px', 
        fill: '#fff', 
        fontStyle: 'bold'
      }
    );
    
    this.objectivesContainer.add([titleBg, title]);
    
    // Add objectives with proper spacing
    this.objectives.forEach((obj, index) => {
      const yPos = index * itemSpacing + 35;
      let text = obj.description;
      let completed = false;
      
      if (obj.type === 'collect') {
        const current = this.collectedItems[obj.item] || 0;
        text = `${obj.description} (${current}/${obj.target})`;
        completed = current >= obj.target;
      } else if (obj.type === 'score') {
        text = `Score ${obj.target} points (${this.score}/${obj.target})`;
        completed = this.score >= obj.target;
      }
    
      // Add checkmark for completed objectives
      const checkmark = this.add.text(
        10, 
        yPos, 
        completed ? '✓ ' : '○ ', 
        { 
          fontSize: isMobile ? '14px' : '16px', 
          fill: completed ? '#4cff00' : '#ffffff'
        }
      );
      
      const objText = this.add.text(
        30, 
        yPos, 
        text, 
        { 
          fontSize: isMobile ? '14px' : '16px', 
          fill: completed ? '#4cff00' : '#ffffff',
          fontStyle: completed ? 'bold' : 'normal'
        }
      );
      
      // Add progress bar for collect objectives
      if (obj.type === 'collect') {
        const current = this.collectedItems[obj.item] || 0;
        const progress = Math.min(1, current / obj.target);
        const progressWidth = containerWidth - 40;
        
        const progressBar = this.add.rectangle(
          30,
          yPos + 15,
          progressWidth * progress,
          4,
          completed ? '#4cff00' : '#4a90e2'
        ).setOrigin(0, 0.5);
        
        const progressBg = this.add.rectangle(
          30,
          yPos + 15,
          progressWidth,
          4,
          'rgba(255,255,255,0.3)'
        ).setOrigin(0, 0.5);
        
        this.objectivesContainer.add([progressBg, progressBar]);
      }
      
      this.objectivesContainer.add([checkmark, objText]);
    });
    
    // Make sure tiles are above the objectives box
    this.children.bringToTop(this.objectivesContainer);
  }

  checkObjectives() {
    if (this.levelComplete) return;

    let allCompleted = true;
    
    this.objectives.forEach(obj => {
      if (obj.type === 'collect') {
        const current = this.collectedItems[obj.item] || 0;
        if (current < obj.target) {
          allCompleted = false;
        }
      } else if (obj.type === 'score') {
        if (this.score < obj.target) {
          allCompleted = false;
        }
      }
    });
  
    if (allCompleted) {
      this.levelComplete = true;
      this.showLevelComplete();
    } else if (this.movesLeft <= 0) {
      this.showLevelFailed();
    }
  }

  showLevelComplete() {
    // Calculate stars (1-3 based on score percentage)
    const level = levelConfig[this.currentLevel];
    const scorePercent = Math.min(1, this.score / level.targetScore);
    const stars = Math.max(1, Math.ceil(scorePercent * 3));
    this.stars = Math.max(this.stars, stars);
    
    // Disable input on the grid
    this.input.enabled = false;

    // Create a dark overlay
    const overlay = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7
    ).setDepth(200).setScrollFactor(0);

    // Create popup
    const popup = this.add.graphics()
      .fillStyle(0x1a1a1a, 1)
      .fillRoundedRect(
        this.cameras.main.centerX - 150,
        this.cameras.main.centerY - 150,
        300,
        300,
        15
      )
      .lineStyle(4, 0x4CAF50)
      .strokeRoundedRect(
        this.cameras.main.centerX - 150,
        this.cameras.main.centerY - 150,
        300,
        300,
        15
      )
      .setDepth(201);
      
    // Add text
    const title = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 100,
      'Level Complete!', 
      { 
        fontSize: '28px', 
        fill: '#4CAF50', 
        fontStyle: 'bold' 
      }
    ).setOrigin(0.5).setDepth(202);
    
    // Add stars
    for (let i = 0; i < 3; i++) {
      this.add.text(
        this.cameras.main.centerX - 60 + i * 60,
        this.cameras.main.centerY - 30,
        i < stars ? '★' : '☆', 
        { 
          fontSize: '40px', 
          fill: i < stars ? '#FFD700' : '#888' 
        }
      ).setOrigin(0.5).setDepth(202);
    }
    
    // Add next level button
    const nextButton = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 80,
      180,
      50,
      0x4CAF50
    )
    .setInteractive()
    .on('pointerover', () => nextButton.setFillStyle(0x45a049))
    .on('pointerout', () => nextButton.setFillStyle(0x4CAF50))
    .on('pointerdown', () => {
      this.input.enabled = true;
      this.initLevel(this.currentLevel + 1);
      overlay.destroy();
      popup.destroy();
      title.destroy();
      nextButton.destroy();
      nextButtonText.destroy();
    })
    .setDepth(202);
    
    const nextButtonText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 80,
      'Next Level', 
      { 
        fontSize: '20px', 
        fill: '#fff' 
      }
    ).setOrigin(0.5).setDepth(203);
  }

  //   // Create popup
  //   const popup = this.add.graphics();
  //   popup.fillStyle(0x000000, 0.7);
  //   popup.fillRect(50, 150, 300, 250);
  //   popup.lineStyle(4, 0x4CAF50);
  //   popup.strokeRect(50, 150, 300, 250);
    
  //   // Add text
  //   const title = this.add.text(200, 180, 'Level Complete!', 
  //     { fontSize: '28px', fill: '#4CAF50', fontStyle: 'bold' }).setOrigin(0.5);
      
  //   // Add stars
  //   for (let i = 0; i < 3; i++) {
  //     const star = this.add.text(140 + i * 60, 230, i < stars ? '★' : '☆', 
  //       { fontSize: '40px', fill: i < stars ? '#FFD700' : '#888' }).setOrigin(0.5);
  //   }
    
  //   // Add next level button
  //   const nextButton = this.add.rectangle(200, 330, 150, 40, 0x4CAF50)
  //     .setInteractive()
  //     .on('pointerover', () => nextButton.setFillStyle(0x45a049))
  //     .on('pointerout', () => nextButton.setFillStyle(0x4CAF50))
  //     .on('pointerdown', () => {
  //       this.initLevel(this.currentLevel + 1);
  //       popup.destroy();
  //       title.destroy();
  //       nextButton.destroy();
  //       nextButtonText.destroy();
  //     });
    
  //   const nextButtonText = this.add.text(200, 330, 'Next Level', 
  //     { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
  // }

  showLevelFailed() {
    // Create popup
    const popup = this.add.graphics();
    popup.fillStyle(0x000000, 0.7);
    popup.fillRect(50, 200, 300, 150);
    popup.lineStyle(4, 0xF44336);
    popup.strokeRect(50, 200, 300, 150);
    
    // Add text
    const text = this.add.text(200, 250, 'Level Failed!\nTry Again?', 
      { fontSize: '24px', fill: '#F44336', align: 'center' }).setOrigin(0.5);
      
    // Add retry button
    const retryButton = this.add.rectangle(200, 310, 150, 40, 0xF44336)
      .setInteractive()
      .on('pointerover', () => retryButton.setFillStyle(0xd32f2f))
      .on('pointerout', () => retryButton.setFillStyle(0xF44336))
      .on('pointerdown', () => {
        this.initLevel(this.currentLevel);
        popup.destroy();
        text.destroy();
        retryButton.destroy();
        retryButtonText.destroy();
      });
    
    const retryButtonText = this.add.text(200, 310, 'Retry', 
      { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
  }
  
  showGameComplete() {
    // Create popup
    const popup = this.add.graphics();
    popup.fillStyle(0x000000, 0.8);
    popup.fillRect(50, 150, 300, 200);
    popup.lineStyle(4, 0x9C27B0);
    popup.strokeRect(50, 150, 300, 200);
    
    // Add text
    const text = this.add.text(200, 200, 'Game Complete!\nCongratulations!', 
      { fontSize: '28px', fill: '#9C27B0', align: 'center' }).setOrigin(0.5);
      
    // Add menu button
    const menuButton = this.add.rectangle(200, 280, 150, 40, 0x9C27B0)
      .setInteractive()
      .on('pointerover', () => menuButton.setFillStyle(0x7B1FA2))
      .on('pointerout', () => menuButton.setFillStyle(0x9C27B0))
      .on('pointerdown', () => {
        // Restart the game
        this.scene.restart();
      });
      
    const menuButtonText = this.add.text(200, 280, 'Main Menu', 
      { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
  }

  create() {
    // Clear the scene
    this.children.removeAll();

    // Set the game dimensions
    const { width, height } = this.scale;
    this.isMobile = width < 768;

    // Adjust camera and world bounds
    this.cameras.main.setViewport(0, 0, width, height);
    this.physics.world.setBounds(0, 0, width, height);

    // Create cartoon-style background
    this.createBackground();
    
    // Create title
    this.add.text(200, 10, 'Nutrition Match', { 
      fontSize: '24px', 
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(100);
    
    // Create score text
    // this.score = 0;
    // this.scoreText = this.add.text(16, 80, 'Score: 0', { 
    //   fontSize: '24px', 
    //   fill: '#ffffff',
    //   backgroundColor: '#4a90e2',
    //   padding: { x: 15, y: 8 },
    //   stroke: '#000000',
    //   strokeThickness: 3
    // });

    // Create game grid
    //this.createGrid();

    // Initialize score
    this.score = 0;
  
    // Initialize first level
    this.initLevel(0);
  }

  createBackground() {
    const { width, height } = this.scale;
    // Sky blue background
    //this.add.rectangle(200, 300, 400, 600, 0x87CEEB);
    this.add.rectangle(0, 0, width, height, 0x87CEEB)
      .setOrigin(0)
      .setScrollFactor(0);

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
    const { width } = this.scale;
    const offsetX = (width - (this.gridSize * this.tileSize)) / 2;
    const offsetY = this.isMobile ? 120 : 150;
    
    // Clear existing grid
    this.grid = [];

    // Create a container for the grid
    if (!this.gridContainer) {
      this.gridContainer = this.add.container(0, 0).setDepth(50);
    } else {
      this.gridContainer.removeAll(true);
    }
    
    for (let y = 0; y < this.gridSize; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.gridSize; x++) {
        const randomItem = foodItems[Math.floor(Math.random() * foodItems.length)];
        
        // Create a container for the tile
        const tileContainer = this.add.container(
          offsetX + x * this.tileSize + this.tileSize / 2,
          offsetY + y * this.tileSize + this.tileSize / 2
        ).setDepth(50);

        // Create background for the tile (rounded rectangle)
        const tileBg = this.add.rectangle(0, 0, this.tileSize - 4, this.tileSize - 4, randomItem.color);
        tileBg.setStrokeStyle(3, 0x000000);
        tileBg.setOrigin(0.5);
        
        // Add emoji icon
        const icon = this.add.text(0, 0, randomItem.icon, {
          fontSize: '30px'
        }).setOrigin(0.5);
        
        // Add objects to container
        tileContainer.add([tileBg, icon]);
        
        // Make it interactive
        tileContainer.setInteractive(new Phaser.Geom.Rectangle(-this.tileSize/2, -this.tileSize/2, this.tileSize, this.tileSize), Phaser.Geom.Rectangle.Contains);
        
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
        this.gridContainer.add(tileContainer);
      }
    }
    
    // Ensure no initial matches
    this.removeInitialMatches();
  }

  handleTileClick(tile) {
    // Don't allow interaction during animations, processing, or if level is complete
    if (this.isSwapping || this.isProcessing || this.levelComplete) return;

    
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
    const offsetX = (400 - (this.gridSize * this.tileSize)) / 2;
    const offsetY = 150;

    const newX1 = offsetX + tile2.gridX * this.tileSize + this.tileSize / 2;
    const newY1 = offsetY + tile2.gridY * this.tileSize + this.tileSize / 2;

    const newX2 = offsetX + tile1.gridX * this.tileSize + this.tileSize / 2;
    const newY2 = offsetY + tile1.gridY * this.tileSize + this.tileSize / 2;
    
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
    const offsetX = (400 - (this.gridSize * this.tileSize)) / 2;
    const offsetY = 150;

    const originalX1 = offsetX + originalPos1.x * this.tileSize + this.tileSize / 2;
    const originalY1 = offsetY + originalPos1.y * this.tileSize + this.tileSize / 2;

    const originalX2 = offsetX + originalPos2.x * this.tileSize + this.tileSize / 2;
    const originalY2 = offsetY + originalPos2.y * this.tileSize + this.tileSize / 2;
    
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
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize - 2; x++) {
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
          for (let i = x + 3; i < this.gridSize; i++) {
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
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize - 2; y++) {
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
          for (let i = y + 3; i < this.gridSize; i++) {
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

  // processMatches(matches) {
  //   this.isProcessing = true;

  //   // Update score
  //   this.score += matches.length * 10;
  //   this.scoreText.setText('Score: ' + this.score);

  //   // // Show nutrition fact for one of the matched tiles with glass effect
  //   // if (matches.length > 0) {
  //   //   const glassBg = this.add.rectangle(200, 300, 350, 150, 0xffffff);
  //   //   glassBg.setAlpha(0.85);
  //   //   glassBg.setStrokeStyle(2, 0x000000);

  //   //   const shadow = this.add.rectangle(205, 305, 350, 150, 0x000000);
  //   //   shadow.setAlpha(0.3);
  //   //   shadow.setDepth(1000);

  //   //   glassBg.setDepth(1001);

  //   //   const factText = this.add.text(200, 300, matches[0].itemData.fact, {
  //   //     fontSize: '20px',
  //   //     fill: '#000000',
  //   //     wordWrap: { width: 300 },
  //   //     align: 'center',
  //   //     fontStyle: 'bold'
  //   //   }).setOrigin(0.5);

  //   //   factText.setDepth(1002);

  //   //   const textBg = this.add.rectangle(200, 300, 310, 110, 0xffffff, 0);
  //   //   textBg.setStrokeStyle(1, 0x000000);
  //   //   textBg.setDepth(1001);

  //   //   this.time.delayedCall(2500, () => {
  //   //     shadow.destroy();
  //   //     glassBg.destroy();
  //   //     factText.destroy();
  //   //     textBg.destroy();
  //   //   });
  //   // }

  //   const bubbleWidth = 350;
  //   const bubbleHeight = 100;  // Reduced height for better fit
  //   const bubbleX = 200;  // Center of the screen
  //   const bubbleY = 500;  // Position at the bottom of the screen

  //   // Create chat bubble tail
  //   const bubbleTail = this.add.triangle(
  //     bubbleX, bubbleY - bubbleHeight/2 + 5,  // Position above the bubble
  //     0, 15,  // Point down (width, height)
  //     15, 15,  // Base point 1
  //     7.5, 0,  // Tip point
  //     0xffffff  // White color
  //   ).setOrigin(0.5, 0).setAlpha(0.85).setDepth(1001);

  //   // Create bubble background with rounded corners
  //   const bubbleBg = this.add.graphics();
  //   bubbleBg.fillStyle(0xffffff, 0.9);
  //   bubbleBg.lineStyle(2, 0x000000);
  //   bubbleBg.fillRoundedRect(
  //     bubbleX - bubbleWidth/2, 
  //     bubbleY - bubbleHeight/2, 
  //     bubbleWidth, 
  //     bubbleHeight, 
  //     15  // Corner radius
  //   );
  //   bubbleBg.strokeRoundedRect(
  //     bubbleX - bubbleWidth/2, 
  //     bubbleY - bubbleHeight/2, 
  //     bubbleWidth, 
  //     bubbleHeight, 
  //     15  // Corner radius
  //   );
  //   bubbleBg.setDepth(1000);

  //   // Create the fact text
  //   const factText = this.add.text(
  //     bubbleX, 
  //     bubbleY - 10,  // Slight adjustment for better centering
  //     matches[0].itemData.fact, 
  //     {
  //       fontSize: '16px',
  //       fill: '#000000',
  //       wordWrap: { width: 320 },  // Slightly wider for better text flow
  //       align: 'center',
  //       fontStyle: 'bold',
  //       padding: { top: 5, bottom: 5, left: 10, right: 10 }  // Add some padding
  //     }
  //   ).setOrigin(0.5, 0.5).setDepth(1002);

  //   // Remove after delay
  //   this.time.delayedCall(2500, () => {
  //     bubbleBg.destroy();
  //     factText.destroy();
  //     bubbleTail.destroy();
  //   });

  //   matches.forEach(tile => {
  //     this.grid[tile.gridY][tile.gridX] = null;

  //     this.tweens.add({
  //       targets: tile,
  //       scale: 0,
  //       alpha: 0,
  //       duration: 300,
  //       ease: 'Power2',
  //       onComplete: () => {
  //         tile.destroy();
  //       }
  //     });
  //   });

  //   this.time.delayedCall(350, () => {
  //     this.dropTiles();
  //     this.time.delayedCall(450, () => {
  //       this.fillEmptySpaces();
  //       this.time.delayedCall(600, () => {
  //         const newMatches = this.findAllMatches();
  //         if (newMatches.length > 0) {
  //           this.processMatches(newMatches);
  //         } else {
  //           this.isSwapping = false;
  //           this.isProcessing = false;
  //           this.checkForPossibleMoves();
  //         }
  //       });
  //     });
  //   });
  // }

  processMatches(matches) {
    this.isProcessing = true;

    // Track collected items
    matches.forEach(tile => {
     const itemName = tile.itemData.name;
     this.collectedItems[itemName] = (this.collectedItems[itemName] || 0) + 1;
    });    

    // Update moves and check objectives if it was a valid move
    if (matches.length > 0) {
     this.movesLeft--;
      this.updateUI();
      this.checkObjectives();
    }

    // Update score
    this.score += matches.length * 10;
    this.scoreText.setText('Score: ' + this.score);

    // Show nutrition fact in chat bubble (only if not already showing one)
    if (!this.isShowingFact && matches.length > 0) {
      this.isShowingFact = true;
    
      const bubbleWidth = 350;
      const bubbleHeight = 100;
      const bubbleX = 200;
      const bubbleY = 500;

      // Create chat bubble tail
      const bubbleTail = this.add.triangle(
        bubbleX, bubbleY - bubbleHeight/2 + 5,
        0, 15, 15, 15, 7.5, 0, 0xffffff
      ).setOrigin(0.5, 0).setAlpha(0.85).setDepth(1001);

      // Create bubble background
      const bubbleBg = this.add.graphics();
      bubbleBg.fillStyle(0xffffff, 0.9);
      bubbleBg.lineStyle(2, 0x000000);
      bubbleBg.fillRoundedRect(
        bubbleX - bubbleWidth/2, 
        bubbleY - bubbleHeight/2, 
        bubbleWidth, 
        bubbleHeight, 
        15
      );
      bubbleBg.strokeRoundedRect(
        bubbleX - bubbleWidth/2, 
        bubbleY - bubbleHeight/2, 
        bubbleWidth, 
        bubbleHeight, 
        15
      );
      bubbleBg.setDepth(1000);

      // Create the fact text
      const factText = this.add.text(
        bubbleX, 
        bubbleY - 10,
        matches[0].itemData.fact, 
        {
          fontSize: '16px',
          fill: '#000000',
          wordWrap: { width: 320 },
          align: 'center',
          fontStyle: 'bold',
          padding: { top: 5, bottom: 5, left: 10, right: 10 }
        }
      ).setOrigin(0.5, 0.5).setDepth(1002);

      // Remove after delay
      this.time.delayedCall(2500, () => {
        bubbleBg.destroy();
        factText.destroy();
        bubbleTail.destroy();
        this.isShowingFact = false; // Reset the flag when done
      });
    }

    // Process matched tiles
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

    // Process board updates
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
            if (!this.levelComplete) {
              this.checkForPossibleMoves();
            }
          }
        });
      });
    });
  }

  dropTiles() {
    const offsetX = (400 - (this.gridSize * this.tileSize)) / 2;
    const offsetY = 150;

    for (let x = 0; x < this.gridSize; x++) {
      const tilesInColumn = [];
      for (let y = this.gridSize - 1; y >= 0; y--) {
        if (this.grid[y] && this.grid[y][x]) {
          tilesInColumn.push(this.grid[y][x]);
          this.grid[y][x] = null;
        }
      }

      for (let i = 0; i < tilesInColumn.length; i++) {
        const tile = tilesInColumn[i];
        const targetY = this.gridSize - 1 - i;

        if (!this.grid[targetY]) this.grid[targetY] = [];
        this.grid[targetY][x] = tile;
        tile.gridY = targetY;
        tile.gridX = x;

        const targetYPos = offsetY + targetY * this.tileSize + this.tileSize / 2;

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
    const offsetX = (400 - (this.gridSize * this.tileSize)) / 2;
    const offsetY = 150;

    for (let y = 0; y < this.gridSize; y++) {
      if (!this.grid[y]) this.grid[y] = [];

      for (let x = 0; x < this.gridSize; x++) {
        if (!this.grid[y][x]) {
          const randomItem = foodItems[Math.floor(Math.random() * foodItems.length)];

          const startY = offsetY - (this.gridSize - y) * this.tileSize - 60;

          const tileContainer = this.add.container(
            offsetX + x * this.tileSize + this.tileSize / 2,
            startY
          );

          const tileBg = this.add.rectangle(0, 0, this.tileSize - 4, this.tileSize - 4, randomItem.color);
          tileBg.setStrokeStyle(3, 0x000000);
          tileBg.setOrigin(0.5);

          const icon = this.add.text(0, 0, randomItem.icon, {
            fontSize: '30px'
          }).setOrigin(0.5);

          tileContainer.add([tileBg, icon]);

          tileContainer.setInteractive(
            new Phaser.Geom.Rectangle(-this.tileSize/2, -this.tileSize/2, this.tileSize, this.tileSize),
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

          const targetY = offsetY + y * this.tileSize + this.tileSize / 2;

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
  
  checkForPossibleMoves() {
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const tile = this.grid[y][x];
        if (!tile) continue;

        if (x < this.gridSize - 1) {
          const rightTile = this.grid[y][x + 1];
          if (rightTile && this.wouldCreateMatch(tile, rightTile)) {
            return true;
          }
        }

        if (y < this.gridSize - 1) {
          const downTile = this.grid[y + 1][x];
          if (downTile && this.wouldCreateMatch(tile, downTile)) {
            return true;
          }
        }
      }
    }

    this.shuffleBoard();
    return false;
  }

  wouldCreateMatch(tile1, tile2) {
    this.swapGridPositions(tile1, tile2);
    const matches = this.findAllMatches();
    this.swapGridPositions(tile1, tile2);
    return matches.length > 0;
  }

  shuffleBoard() {
    const allTiles = [];
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        if (this.grid[y][x]) {
          allTiles.push(this.grid[y][x]);
        }
      }
    }

    for (let i = allTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempData = allTiles[i].itemData;
      allTiles[i].itemData = allTiles[j].itemData;
      allTiles[j].itemData = tempData;

      allTiles[i].removeAll(true);
      const tileBg1 = this.add.rectangle(0, 0, this.tileSize - 4, this.tileSize - 4, allTiles[i].itemData.color);
      tileBg1.setStrokeStyle(3, 0x000000);
      tileBg1.setOrigin(0.5);
      const icon1 = this.add.text(0, 0, allTiles[i].itemData.icon, {
        fontSize: '30px'
      }).setOrigin(0.5);
      allTiles[i].add([tileBg1, icon1]);
      allTiles[i].bg = tileBg1;

      allTiles[j].removeAll(true);
      const tileBg2 = this.add.rectangle(0, 0, this.tileSize - 4, this.tileSize - 4, allTiles[j].itemData.color);
      tileBg2.setStrokeStyle(3, 0x000000);
      tileBg2.setOrigin(0.5);
      const icon2 = this.add.text(0, 0, allTiles[j].itemData.icon, {
        fontSize: '30px'
      }).setOrigin(0.5);
      allTiles[j].add([tileBg2, icon2]);
      allTiles[j].bg = tileBg2;
    }

    this.removeInitialMatches();

    const shuffleText = this.add.text(200, 300, 'No moves! Shuffling...', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: '#ff6600',
      padding: { x: 20, y: 10 },
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(2000);

    this.time.delayedCall(1500, () => {
      shuffleText.destroy();
    });
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
        const tileBg = this.add.rectangle(0, 0, this.tileSize - 4, this.tileSize - 4, newItem.color);
        tileBg.setStrokeStyle(3, 0x000000);
        tileBg.setOrigin(0.5);
        
        const icon = this.add.text(0, 0, newItem.icon, {
          fontSize: '30px'
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
        backgroundColor: '#87CEEB',
        scene: [GameScene],
        audio: {
          noAudio: true
        },
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