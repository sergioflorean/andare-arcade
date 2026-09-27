# ANDARE Arcade

## Game

**Working title:** ANDARE Shooter

**Genre:** Vertical Shoot 'Em Up

**Style:** Retro arcade / pixel art

**Players:** 1

**Platform:** Web / Arcade Cabinet

---

## Core Idea

The player controls a pasta-themed hero in a vertical arcade shooter.

Enemies move toward the player from the top of the screen.

The player must destroy enemies, collect power-ups, earn points, and survive increasingly difficult stages.

---

## Controls

- Move Up: ArrowUp
- Move Down: ArrowDown
- Move Left: ArrowLeft
- Move Right: ArrowRight
- Shoot: A
- Special Attack: B
- Start: Enter
- Pause: Escape

These controls will later be mapped to a physical arcade joystick and buttons.

---

# Player

## Main Character

The player will be an original ANDARE pasta character.

The final character design is still to be defined.

### Initial concept

A pasta-based flying character inspired by the ANDARE brand.

Possible designs:

1. Pasta box spaceship
2. Ravioli pilot
3. Fusilli spaceship
4. Pasta bowl spaceship

The character should be recognizable even at a small pixel-art size.

---

## Player States

The player will eventually support:

- Idle
- Moving
- Shooting
- Damaged
- Invulnerable
- Power-Up
- Death

---

## Player Stats

Initial values:

- Lives: 3
- Health: 1
- Speed: TBD
- Fire Rate: TBD
- Damage: 1

---

# Weapons

## Main Weapon

Basic pasta projectile.

Possible visual concepts:

- Fusilli bullet
- Spaghetti laser
- Parmesan shot
- Tomato sauce projectile

---

# Power-Ups

Possible power-ups:

### Pesto

Spread shot.

### Parmesan

Increased damage.

### Tomato Sauce

Increased fire rate.

### Garlic

Temporary shield.

---

# Enemies

Possible enemies:

- Evil Tomato
- Flying Fork
- Cheese Grater
- Meatball
- Chili Pepper
- Kitchen Robot

---

# Bosses

Possible bosses:

- Giant Colander
- Giant Fork
- Pasta Machine
- Giant Tomato

---

# Score

The player receives points for:

- Destroying enemies
- Collecting items
- Defeating bosses
- Completing stages

The highest scores will later be stored using the backend API.

---

# Game Flow

Start Screen

↓

Press Start

↓

Stage

↓

Enemies

↓

Boss

↓

Stage Complete

↓

Next Stage

↓

Game Over

↓

Enter Player Name

↓

Leaderboard

---

# Visual Style

Pixel art inspired by classic arcade games.

Main ANDARE colors:

- Cream
- Red
- Yellow
- Brown

The game must use original graphics and characters.

---

# Arcade Goal

The final game should run automatically when the arcade machine starts.

The player should never need to see:

- operating system
- browser
- desktop
- terminal

The machine should boot directly into ANDARE Arcade.
