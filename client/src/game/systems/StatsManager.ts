export class StatsManager {
  private score = 0;
  private shotsFired = 0;
  private hits = 0;
  private enemiesDefeated = 0;

  addScore(points: number) {
    this.score += points;
  }

  recordShot() {
    this.shotsFired += 1;
  }

  recordHit() {
    this.hits += 1;
  }

  recordEnemyDefeated() {
    this.enemiesDefeated += 1;
  }

  resetStageStats() {
    this.shotsFired = 0;
    this.hits = 0;
    this.enemiesDefeated = 0;
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

  getAccuracy() {
    if (this.shotsFired === 0) {
      return 0;
    }

    return Math.round(
      (this.hits / this.shotsFired) * 100,
    );
  }
}