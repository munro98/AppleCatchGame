"use strict";

class Player extends Entity {
	constructor(pos) {
		super(64, pos)

		this.accel = 1600;
		this.decel = 800;
		this.maxVel = 240;
		this.rotation = 0;

		this.timeSinceLastFire = 0;

		this.texture = "res/player.png";
		

		this.downKeys = new Set();
		this.downKeysFrame = new Set();
		this.lastDownKeys = new Set();

		this.downButtons = new Set();

		this.moved = false;
		this.takeInput = true;

		this.targetPos = pos.copy();
		this.mouse = new Vec2(0, 0);
	}

	updateClient(level, deltaTime) {
		var vec3 = cameraPosition.add(this.getCenter());
		var relvec3 = new Vec2(mouseX, mouseY).sub(vec3);

		this.rotation = Math.atan(relvec3.y / relvec3.x) * 180 / Math.PI;
		if (relvec3.x >= 0.0) {
			this.rotation += 180;
		}

		this.rotation += 90;

	}

	updateServer(deltaTime, level, serverNet) {

		

		

		let deltaPos2 = this.targetPos.sub(this.pos).normalized().mul(deltaTime * this.maxPosCorrection);

		var nextXposition = this.pos.x + deltaPos2.x * deltaTime;
		var hitX = false;

		for (let x = 0; x <= this.width; x += 32) {
			for (let y = 0; y <= this.width; y += 32) {
				hitX |= level.hit(new Vec2(nextXposition + x, this.pos.y + y));
			}
		}

		if (!hitX) {
			this.pos.x += deltaPos2.x * deltaTime;
		}

		var nextYposition = this.pos.y + deltaPos2.y * deltaTime;
		var hitY = false;

		for (let x = 0; x <= this.width; x += 32) {
			for (let y = 0; y <= this.width; y += 32) {
				hitY |= level.hit(new Vec2(this.pos.x + x, nextYposition + y));
			}
		}
		if (!hitY) {
			this.pos.y += deltaPos2.y * deltaTime;
		}

		var inputVec3 = new Vec2(0, 0);
		if (this.downKeysFrame.has(87)) {
			this.moved = true;
			inputVec3.y += -1;
		}
		if (this.downKeysFrame.has(83)) {
			this.moved = true;
			inputVec3.y += 1;
		}

		if (this.downKeys.has(65)) {
			this.moved = true;
			inputVec3.x += -1;
		}
		if (this.downKeys.has(68)) {
			this.moved = true;
			inputVec3.x += 1;
		}

		var deltaPos = inputVec3;
		deltaPos = deltaPos.normalized().mul(deltaTime * this.accel);
		this.vel = this.vel.add(deltaPos);

		if (this.vel.mag() > this.maxVel) {
			this.vel = this.vel.normalized().mul(this.maxVel);
		}

		var deceleration = this.decel * deltaTime;
		if (inputVec3.mag() == 0) {
			if (this.vel.x > 0) {
				this.vel.x = Math.max(this.vel.x - deceleration, 0);
			} else {
				this.vel.x = Math.min(this.vel.x + deceleration, 0);
			}
			if (this.vel.y > 0) {
				this.vel.y = Math.max(this.vel.y - deceleration, 0);
			} else {
				this.vel.y = Math.min(this.vel.y + deceleration, 0);
			}
		}
		//*/
		
		var bulletAngle = -Math.atan2(this.mouse.y, this.mouse.x); // In radians

		var spread = this.activeWeapon.spread;
		bulletAngle += 90 * (Math.PI / 180);


		this.timeSinceLastFire += deltaTime;
		if (this.timeSinceLastFire > this.activeWeapon.timeBetweenShots && this.downButtons.has(1) && this.activeWeapon.ammo > 0) {

			this.timeSinceLastFire = 0;
			//playSound();
			for (var i = 0; i < this.activeWeapon.bulletsEachShot; i++) {

				var offsetAngle = bulletAngle + (Math.random() * spread - (spread * 0.5)) * (Math.PI / 180);
				var bulletVec2 = new Vec2(Math.sin(offsetAngle), Math.cos(offsetAngle));

				var bullet = new Bullet(this.getCenter(), this.activeWeapon.damage);
				bullet.vel = this.mouse.normalized().mul(this.activeWeapon.bulletSpeed);
				level.bullets.push(bullet);
				serverNet.broadcastCreateBullet(bullet);

			}
			this.activeWeapon.ammo = this.activeWeapon.ammo - 1;
		}


		

		super.update(deltaTime, level);
	}

	update(level, deltaTime) {

		this.lifeTime += deltaTime;

		this.downKeysFrame = new Set();
		for (var key of this.downKeys) {
			if (!this.lastDownKeys.has(key)) {
				this.downKeysFrame.add(key);
			}
		}

		if (this.downKeysFrame.has(87)) {
			console.log("Frame");
		}

		var inputVec3 = new Vec2(0, 0);
		if (this.downKeysFrame.has(87) && this.onGround) {
			this.moved = true;
			//inputVec3.y += -1;
			this.vel.y = -600;
		}
		if (this.downKeysFrame.has(83)) {
			this.moved = true;
			//inputVec3.y += 1;
		}

		if (this.downKeys.has(65)) {
			this.moved = true;
			inputVec3.x += -1;
		}
		if (this.downKeys.has(68)) {
			this.moved = true;
			inputVec3.x += 1;
		}

		var deltaPos = inputVec3;
		deltaPos = deltaPos.normalized().mul(deltaTime * this.accel);
		this.vel = this.vel.add(deltaPos);

		if (this.vel.mag() > this.maxVel) {
			//this.vel = this.vel.normalized().mul(this.maxVel);
		}

		if (this.onGround) {
			this.vel.x *= 114.0 * deltaTime;
		} else {
			this.vel.x *= 118.0 * deltaTime;
		}
		
		this.lastDownKeys = new Set(this.downKeys);

		super.update(level, deltaTime);
	}

}
