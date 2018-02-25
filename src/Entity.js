"use strict";

class Entity {
	constructor(size, pos) {
		this.pos = pos;
		this.vel = new Vec2(0, 0);

		this.width = size;
		this.height = size;
		this.lifeTime = 0;
		this.health = 100;
		this.rotation = 0;

		this.mass = 10;
		this.remove = false;
	}

	// TODO reorder
	update(deltaTime, level) {

		///*
		var nextXposition = this.pos.x + this.vel.x * deltaTime;
		var hitX = false;

		for (let x = 0; x <= this.width; x += 32) {
			for (let y = 0; y <= this.width; y += 32) {
				hitX |= level.hit(new Vec2(nextXposition + x, this.pos.y + y));
			}
		}

		if (!hitX) {
			this.pos.x += this.vel.x * deltaTime;
		} else {
			this.vel.x = 0;
		}

		var nextYposition = this.pos.y + this.vel.y * deltaTime;
		var hitY = false;

		for (let x = 0; x <= this.width; x += 32) {
			for (let y = 0; y <= this.width; y += 32) {
				hitY |= level.hit(new Vec2(this.pos.x + x, nextYposition + y));
			}
		}
		if (!hitY) {
			this.pos.y += this.vel.y * deltaTime;
		} else {
			this.vel.y = 0;
		}
		//*/

		this.lifeTime += deltaTime;

		if (this.health < 0) {
			this.remove = true;
		}
	}

	getCenter() {
		return this.pos.add(new Vec2(this.width * 0.5, this.height * 0.5));
	}

	isIntersecting(other) {
		if (other.pos.x + other.width < this.pos.x || other.pos.x > this.pos.x + this.width) return false;
		if (other.pos.y + other.height < this.pos.y || other.pos.y > this.pos.y + this.height) return false;
		return true;
	}

	isPointIntersecting(other) {
		if (other.pos.x < this.pos.x || other.pos.x > this.pos.x + this.width) return false;
		if (other.pos.y < this.pos.y || other.pos.y > this.pos.y + this.height) return false;
		return true;
	}

	isPointIntersecting2(other) {
		if (other.x < this.pos.x || other.x > this.pos.x + this.width) return false;
		if (other.y < this.pos.y || other.y > this.pos.y + this.height) return false;
		return true;
	}

	draw(view) {
		var vec = view.add(this.pos);
		vec.x = Math.floor(vec.x);
		vec.y = Math.floor(vec.y);

		ctx.save();
		ctx.translate(vec.x, vec.y);
		//ctx.strokeStyle = "rgb(255,0,0)";
		ctx.strokeRect(0, 0, this.width, this.height);

		ctx.translate(+this.width * 0.5, +this.width * 0.5);
		ctx.rotate(this.rotation * Math.PI / 180);

		ctx.drawImage(texture.getTexture(this.texture), -this.width/2, -this.height/2);
		ctx.restore();

	}

}
