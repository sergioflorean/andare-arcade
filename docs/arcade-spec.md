# ANDARE Pasta Rush - Arcade Specification

## Arcade Direction

ANDARE Pasta Rush will be designed to behave and feel like a classic vertical arcade game from the early/mid 1980s.

The game should prioritize:

- simple controls
- fast gameplay
- high scores
- increasing difficulty
- short sessions
- recognizable pixel art
- attract mode
- arcade cabinet compatibility

---

## Logical Resolution

224 x 288 pixels

Portrait orientation.

The game will always render internally at this resolution.

Modern displays will scale the game while preserving its original aspect ratio and pixel-art appearance.

---

## Frame Rate

Target: 60 FPS

---

## Rendering

- Pixel-perfect rendering
- No image smoothing
- Integer scaling when possible
- Limited retro-style color palette

---

## Player

Official character:

**ANDARE Classic Box**

The player is a flying ANDARE takeout box with living pasta visible inside.

The box acts as the vehicle.

The pasta is the hero.

Approximate initial sprite size:

24 x 24 pixels

---

## Controls

Joystick:

- Up
- Down
- Left
- Right

Button A:

- Primary Fire

Button B:

- Special / Power-Up

Start:

- Start Game

---

## Base Weapon

### Spaghetti Shot

Fast vertical pasta projectile.

---

## Power-Ups

### Salsa Rossa

Rapid fire.

### Pesto

Spread shot.

### Parmesan

Heavy damage shot.

### Garlic

Temporary shield.

---

## Lives

Initial lives:

3

---

## Game Loop

Attract Mode

↓

Press Start

↓

Stage

↓

Enemy Waves

↓

Boss

↓

Stage Clear

↓

Next Stage

↓

Game Over

↓

Initial Entry

↓

High Score Table

↓

Attract Mode

---

## Enemy Behavior

Enemies should use predefined arcade-style attack patterns instead of purely random movement.

Examples:

- formation entry
- diagonal attacks
- diving attacks
- circular movement
- synchronized waves

---

## Scoring

Points are awarded for:

- destroying enemies
- destroying enemies during attack patterns
- collecting ingredients
- defeating bosses
- completing stages

---

## High Scores

The arcade will maintain a leaderboard.

Players enter three initials after achieving a high score.

Example:

SER - 012850

---

## Attract Mode

When no player is active, the arcade cycles through:

1. Title screen
2. How to Play
3. Gameplay demo
4. High Scores
5. Title screen

---

## Final Hardware Goal

The game must eventually run inside a physical arcade cabinet using:

- display
- mini PC or equivalent
- arcade joystick
- arcade buttons
- USB encoder

The operating system should not normally be visible to players.
