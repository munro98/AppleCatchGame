"use strict";
class Apple {
	constructor(pos) {
		this.pos = new Vec2(pos.x, pos.y);
		this.vel = new Vec2(0, 0);

		this.width = 16;
		this.height = 16;
		this.lifeTime = 0;
		this.rotation =  Math.random() * 360;

		this.texture = "res/apple.png";
		this.remove = false;
	}

	update(level, deltaTime) {

		this.rotation += deltaTime * 100;

		if (level.hit(this.pos)) {
			level.removeWall(this.pos);
			this.remove = true;
		}

		this.pos.x += this.vel.x * deltaTime;
		this.pos.y += this.vel.y * deltaTime;
		this.lifeTime += deltaTime;



		if (this.lifeTime > 8) {
			this.remove = true;
		}
	}

	draw(view) {

		if (this.remove)
			return;
		
		let vec3 = view.add(this.pos);
		if (vec3.x < 0 || vec3.y < 0)
			return;


		ctx.save();
		ctx.translate(vec3.x, vec3.y);
		ctx.rotate(this.rotation * Math.PI / 180);
		ctx.drawImage(texture.getTexture(this.texture), -32, -32, 64, 64);
		ctx.restore();
	}
}
