import Phaser from 'phaser';
import logoImg from './assets/logo.png';

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image('logo', logoImg);
  }

  create() {
    const circle = this.add.circle(600, 200, 64);
    circle.setStrokeStyle(2, 0xff66ff);
    const tenderizer = this.add.isobox(
      200,
      400,
      64,
      200,
      0x00b9f2,
      0x016fce,
      0x028fdf
    );
    const meat = this.add.ellipse(400, 400, 100, 170, 0xff66ff);

    meat.setAngle(90);
    tenderizer.setDepth(1);
    this.clock = new Phaser.Time.Clock(this);
    this.timerEvent = this.clock.addEvent({
      repeat: 20,
      callback: () => {
        console.log('ive ran');
      },
    });
    this.input.on('pointerdown', () => {
      if (tenderizer.angle === 180) tenderizer.angle = 0;
      tenderizer.setAngle(tenderizer.angle + 10);
      //   console.log(tenderizer.angle);
    });
    // const logo = this.add.image(400, 150, 'logo');

    // this.tweens.add({
    //     targets: logo,
    //     y: 450,
    //     duration: 2000,
    //     ease: "Power2",
    //     yoyo: true,
    //     loop: -1
    // });
  }
  update() {
    if (this.timerEvent.repeat > 0) {
      console.log(this.timerEvent);
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
