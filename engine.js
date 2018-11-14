
class Engine {
  constructor(width, height, bucketSize) {
    this.width = width;
    this.height = height;
    this.bucketSize = bucketSize;
    this.agents = [];
    this.buckets = {};
  }

  update() {
    //preClear(this.agents); //Update or move agents
    for(let i in this.agents) {
      this.agents[i].update();
    }
    this.boundaryRepulse(5, 5);
    this.clearBuckets();
    //popManage(this.agents); //Add or remove agents at this point
    this.rehash(); //Rehash the agents
    this.updateLocales();
    //postClear(this.agents); //Agent state transitions
  }

  show(canvas) {
    for(let agent of this.agents) {
      agent.show(canvas);
    }
  }

  clearBuckets() {
    for(let key in this.buckets) {
      //If the bucket was empty remove
      if(this.buckets[key].length == 0) {
        delete this.buckets[key];
      } else { //Otherwise, just clear its contents
        this.buckets[key] = [];
      }
    }
  }

  rehash() {
    for(let agent of this.agents) {
      this.readd(agent);
    }
  }

  //May want to put this ouside the class
  updateLocales() {
    for(let agent of this.agents) {
      var neighborhood = this.inround(agent.pos, agent.species.range);
      agent.locale = {}; //Clear the locale
      for(let near of neighborhood) {
        if(agent.locale[near.species]) {
          agent.locale[near.species].push(near);
        } else {
          agent.locale[near.species] = [near];
        }
      }
      //I'm not filtering out the agent itself because
      //most response vectors are either zero or would produce
      //a steady state
    }
  }

  inround(pos, radius) {
    var selected = this.roughrect(pos, radius, radius);
    return selected.filter(function(agent) {
      return p5.Vector.sub(agent.pos, pos).magSq() < radius*radius;
    });
  }

  inrect(pos, xrange, yrange) {
    var selected = this.roughrect(pos, xrange, yrange);
    return selected.filter(function(agent) {
      return (agent.pos.x > pos.x - xrange) && (agent.pos.x < pos.x + xrange)
          && (agent.pos.y > pos.y - yrange) && (agent.pos.y < pos.y + yrange);
    });
  }

  //All agents in the hash buckets overlaping a rectangle
  roughrect(pos, xrange, yrange) {
    //Create upper and lower rectangle corners
    var offset = sim.createVector(xrange, yrange);
    var [lx, ly] = this.hashPair(p5.Vector.sub(pos, offset));
    var [ux, uy] = this.hashPair(p5.Vector.add(pos, offset));
    //Add all from the buckets between upper bucket and lower bucket
    var selected = [];
    for(var x = lx ; x <= ux; x++) {
      for(var y = ly; y <= uy; y++) {
        var cur = this.hashBucket(x + ',' + y);
        if(cur.length != 0) {
          selected.push(...cur); //Spread operator
        }
      }
    }
    return selected;
  }

  nearest(pos, range) {
    var consider = this.inround(pos, range);
    if(consider.length == 0) {
      return null;
    }
    else if(consider.length == 1) {
      return consider[0];
    }
    var mindist = range**2;
    var closest = consider[0];
    for(var agent of consider) {
      var dist = p5.Vector.sub(agent.pos, pos).magSq();
      if(dist < mindist) {
        mindist = dist;
        closest = agent;
      }
    }
    return closest;
  }

  hashBucket(key)
  {
    if(this.buckets[key]) {
      return this.buckets[key];
    } else {
      return [];
    }
  }

  hashPair(pos) {
    return [Math.trunc(pos.x/this.bucketSize), Math.trunc(pos.y/this.bucketSize)];
  }

  //Use to add a new object
  add(object) {
    this.clamp(object); //Sanitize the object for use in environment
    this.agents.push(object);
    this.insert(object);
  }

  readd(object) {
    this.clamp(object); //Sanitize the object for use in environment
    this.insert(object);
  }

  //Method to insert a prexisitng "sanitized" object
  insert(object) {
    var [x, y] = this.hashPair(object.pos);
    var key = x + ',' + y;
    if(this.buckets[key]) {
      this.buckets[key].push(object);
    } else {
      this.buckets[key] = [object];
    }
  }

  //Clamp the object inside of the environment
  clamp(object)
  {
    if(object.pos.x < 0) {
      object.pos.x = 0;
    } else if(object.pos.x > this.width) {
      object.pos.x = this.width;
    }
    if(object.pos.y < 0) {
      object.pos.y = 0;
    } else if(object.pos.y > this.height) {
      object.pos.y = this.height;
    }
  }

  boundaryRepulse(edge, force) {
    for(let agent of this.agents) {
      if(agent.pos.x < edge) {
        agent.vel.x += force;
      } else if(agent.pos.x > this.width - edge) {
        agent.vel.x -= force;
      }
      if(agent.pos.y < edge) {
        agent.vel.y += 1;
      } else if(agent.pos.y > this.height - edge) {
        agent.vel.y -= force;
      }
    }

  }

  remove(object) {
    var index = this.agents.indexOf(object);
    if(index > -1) {
      this.agents.splice(index, 1)
    }
  }
}
