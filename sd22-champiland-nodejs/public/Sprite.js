class Sprite {
  constructor(spriteName) {
    this.animation = animations[spriteName];
    this.w = spritesData[spriteName].size[0];
    this.len = this.animation.length;
    this.speed = spritesData[spriteName].speed;
    this.index = 0;
    this.looping = false;
    this.playing = false;
  }

  show(x = 0, y = 0) {
    
    // move to next frame if playing
    if (this.playing) {
      this.index += this.speed;

      if (this.index >= this.len) {
        // stops at the end if not looping 
        if (!this.looping) {
          this.playing = false;
        }
      }
    }
    
    // compute at which frame the animation is
    let index = floor(this.index);
    
    if (index >= this.len) { 
      
      // stays at last frame
      if (!this.looping) {
        index = this.len-1; 
      }
      
      // if looping, back to start
      else {
        this.index = 0;
        index = 0;
      }
    }
    
    image(this.animation[index], x, y);
  }

  isPlaying() {
    return this.playing;
  }
  
  playOnce() {
    this.index = 0;
    this.looping = false;
    this.playing = true;
  }
  
  loop() {
    this.index = 0;
    this.looping = true;
    this.playing = true;
  }
}