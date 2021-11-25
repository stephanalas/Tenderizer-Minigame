import Phaser from 'phaser';
import logoImg from './assets/logo.png';
let innerBoldCircle, innerCircle, outerCirle, tenderizer, win, loss;
class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image('logo', logoImg);
  }

  create() {
    // circle meter creation
    innerCircle = this.add.circle(600, 200, 64);
    innerCircle.setStrokeStyle(2, 0xff66ff);
    innerBoldCircle = this.add.circle(600, 200, 16, 0x00b9f2);
    outerCirle = this.add.circle(600, 200, 128);
    outerCirle.setStrokeStyle(2, 0xff66ff);

    // win and loss text are set to invisible
    win = this.add
      .text(350, 200, 'You win!', {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      })
      .setVisible(false);
    loss = this.add
      .text(350, 200, 'Ooof!', {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      })
      .setVisible(false);

    // "tenderizer" and "meat" game objects
    tenderizer = this.add.isobox(
      200,
      400,
      64,
      200,
      0x00b9f2,
      0x016fce,
      0x028fdf
    );
    tenderizer.setDepth(1);

    const meat = this.add.ellipse(400, 400, 100, 170, 0xff66ff);
    meat.setAngle(90);

    // game variables

    this.clicks = 0;
    this.activeGame = false;
    this.startTime = 0;
    this.endTime = 1000;
    this.timeLeft = 5;

    // might add some game logic to timer event callback
    // this timer resets the clicks to zero every second
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: function () {
        this.clicks = 0;
      },
      loop: true,
      callbackScope: this,
    });

    // timeLeft text
    this.timeLeftText = this.add.text(350, 100, `${this.timeLeft}`);
    // event listener for clicks
    this.input.on('pointerdown', () => {
      if (!this.activeGame) this.activeGame = true;
      this.clicks++;
    });
  }
  update(time, deltaTime) {
    if (this.startTime < this.endTime) {
      // in between seconds

      // game win condition
      if (tenderizer.angle === 90) {
        win.setVisible(true);
        this.scene.pause();
      }
      // if circle is in sweet spot, rotate the tenderizer
      if (
        innerBoldCircle.radius > innerCircle.radius &&
        innerBoldCircle.radius < outerCirle.radius &&
        tenderizer.angle !== 90
      ) {
        tenderizer.setAngle(tenderizer.angle + 6);
      }
      // rotation resistance for tenderizer
      if (tenderizer.angle > 5) {
        tenderizer.setAngle(tenderizer.angle - 5);
      }
      // resistance for meter
      if (innerBoldCircle.radius > 8) {
        innerBoldCircle.setRadius(innerBoldCircle.radius - 2);
      }
      // increase innerCircle radius by the clicks per second
      if (this.clicks) {
        innerBoldCircle.setRadius(innerBoldCircle.radius + this.clicks);
      }
      this.startTime += deltaTime;
    } else {
      // after a second has passed

      // render timeLeft
      if (this.timeLeft > 0 && this.activeGame) {
        this.timeLeft--;
        this.timeLeftText.setText(`${this.timeLeft}`);
      }
      // render gameOver
      if (!this.timeLeft && this.activeGame) {
        this.loss.setVisible(true);
        this.scene.pause();
      }

      this.startTime = 0;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: MyGame,
};

const game = new Phaser.Game(config);
