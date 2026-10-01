const COMBO_DURATION = 2500;

export class StatsManager {
  private score = 0;
  private shotsFired = 0;
  private hits = 0;
  private enemiesDefeated = 0;

  private combo = 0;
  private comboExpiresAt = 0;

  addScore(points: number) {
    this.score += points;
  }

  addComboScore(points: number) {
    this.score += points * this.getMultiplier();
  }

  recordShot() {
    this.shotsFired += 1;
  }

  recordHit() {
    this.hits += 1;
  }

  recordEnemyDefeated(time: number) {
    this.enemiesDefeated += 1;
    this.combo += 1;

    this.comboExpiresAt =
      time + COMBO_DURATION;
  }

  updateCombo(time: number) {
    if (
      this.combo === 0 ||
      time < this.comboExpiresAt
    ) {
      return false;
    }

    this.resetCombo();

    return true;
  }

  resetCombo() {
    this.combo = 0;
    this.comboExpiresAt = 0;
  }

  resetStageStats() {
    this.shotsFired = 0;
    this.hits = 0;
    this.enemiesDefeated = 0;

    this.resetCombo();
  }

  resetAll() {
    this.score = 0;
    this.resetStageStats();
  }

  getScore() {
    return this.score;
  }

  getShotsFired() {
    return this.shotsFired;
  }

  getHits() {
    return this.hits;
  }

  getEnemiesDefeated() {
    return this.enemiesDefeated;
  }

  getCombo() {
    return this.combo;
  }

  getMultiplier() {
    if (this.combo >= 10) return 4;
    if (this.combo >= 6) return 3;
    if (this.combo >= 3) return 2;

    return 1;
  }

  getAccuracy() {
    if (this.shotsFired === 0) return 0;

    return Math.round(
      (this.hits / this.shotsFired) * 100,
    );
  }
}