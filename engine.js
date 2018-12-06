

/**
 * A spacial hashing engine
 * @class
 */
class Engine {


  /**
   * constructor - A constructor for the Engine
   *
   * @param  {number} width      The width of the environment
   * @param  {number} height     The height of the environment
   * @param  {number} bucketSize The size of environment tiles
   * @return {Engine}            An engine object
   */
  constructor(width, height, bucketSize) {
    this.width = width;
    this.height = height;
    this.bucketSize = bucketSize;
    this.agents = [];
    this.buckets = {};
  }



  /**
   * update - Updates all agents that exist in the engine
   *
   */
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


  /**
   * show - Draws all agents in the engine
   *
   * @param  {p5} canvas The p5 instance on which to draw
   * @return {type}        description
   */
  show(canvas) {
    for(let agent of this.agents) {
      agent.show(canvas);
    }
  }

  /**
   * clearBuckets - Resets the engine's spacial hash table
   *
   */
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


  /**
   * rehash - Rehashes all agents in the engine
   *
   */
  rehash() {
    for(let agent of this.agents) {
      this.readd(agent);
    }
  }

  /**
   * updateLocales - Sets each agent's locale to a table of agents within
   * a circular region around the agent
   *
   */
  updateLocales() {
    for(let agent of this.agents) {
      var neighborhood = this.inround(agent.pos, agent.species.range);
      var self = neighborhood.indexOf(agent);
      if(self > -1) {
        neighborhood.splice(self, 1);
      }
      agent.locale = {}; //Clear the locale
      for(let near of neighborhood) {
        if(agent.locale[near.species]) {
          agent.locale[near.species].push(near);
        } else {
          agent.locale[near.species] = [near];
        }
      }
    }
  }


  /**
   * inround - Function to find all the agents in a circular region
   *
   * @param  {p5.Vector} center    The center of the circle
   * @param  {number} radius    The radius of the circle
   * @return {list}        List of agents in the region specified
   */
  inround(center, radius) {
    var selected = this.roughrect(center, radius, radius);
    return selected.filter(function(agent) {
      return p5.Vector.sub(agent.pos, center).magSq() < radius*radius;
    });
  }


  /**
   * inrect - Function to find all the agents in a rectangular region
   *
   * @param  {p5.Vector} pos    The upper right corner of the rectangle
   * @param  {number} xrange Width of the rectangle
   * @param  {number} yrange Height of the rectangle
   * @return {list}        A list of agents
   */
  inrect(pos, xrange, yrange) {
    var selected = this.roughrect(pos, xrange, yrange);
    return selected.filter(function(agent) {
      return (agent.pos.x > pos.x - xrange) && (agent.pos.x < pos.x + xrange)
          && (agent.pos.y > pos.y - yrange) && (agent.pos.y < pos.y + yrange);
    });
  }

  /**
   * roughrect - Function that gets agents from all hashbuckets overlapping
   * the rectangle
   *
   * @param  {p5.Vector} pos    The upper right corner of the rectangle
   * @param  {number} xrange Width of the rectangle
   * @param  {number} yrange Height of the rectangle
   * @return {list}        A list of agents
   */
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
          selected.push(...cur); //Spread operator!
        }
      }
    }
    return selected;
  }


  /**
   * nearest - A function to get the agent nearest to the position specified
   * and within the range specified
   *
   * @param  {p5.Vector} pos   The position to search from
   * @param  {number} range The farthest distance to consider
   * @return {Agent}       Agent closest to the position
   */
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


  /**
   * hashBucket - Function to get the hashbucket associated with a key
   *
   * @param  {string} key The string that is the coordinates of the bucket
   * @return {list}     A list of agents; the bucket contents
   */
  hashBucket(key) {
    if(this.buckets[key]) {
      return this.buckets[key];
    } else {
      return [];
    }
  }


  /**
   * hashPair - A function to compute spatial hashes
   *
   * @param  {p5.Vector} pos A position to hash
   * @return {string}     The hash key for the position
   */
  hashPair(pos) {
    return [Math.trunc(pos.x/this.bucketSize), Math.trunc(pos.y/this.bucketSize)];
  }


  /**
   * add - A function to add a brand new agent to the simulation
   *
   * @param  {Agent} object The agent to add
   */
  add(object) {
    this.clamp(object); //Sanitize the object for use in environment
    this.agents.push(object);
    this.insert(object);
  }


  /**
   * readd - A function to add the object again (without duplicating it) after
   * the hash structure has been cleared for rehashing: do NOT call to add a
   * new agent
   *
   * @param  {type} object Agent to add
   * @return {type}        description
   */
  readd(object) {
    this.clamp(object); //Sanitize the object for use in environment
    this.insert(object);
  }


  /**
   * insert - Method to hash an object in the bounds of the environment
   *
   * @param  {Agent} object An agent that needs to be hashed into the engine
   */
  insert(object) {
    var [x, y] = this.hashPair(object.pos);
    var key = x + ',' + y;
    if(this.buckets[key]) {
      this.buckets[key].push(object);
    } else {
      this.buckets[key] = [object];
    }
  }



  /**
   * clamp - Method to clamp an agent inside the environment
   *
   * @param  {Agent} object The agent to clamp
   */
  clamp(object) {
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


  /**
   * boundaryRepulse - A function that adds margins with a constant force
   *  effect to keep entities inside/cause bouncing on boudaries
   *
   * @param  {type} edge  description
   * @param  {type} force description
   * @return {type}       description
   */
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


  /**
   * remove - Removes an agent, all agents of a species or all agents in a list
   * from the engine depending on the argument
   *
   * @param  {Agent|Species|Agent[]|Species[]} object An agent, species or list of agents or species
   */
  remove(object) {
    if(object instanceof Agent) {
      var index = this.agents.indexOf(object);
      if(index > -1) {
        this.agents.splice(index, 1)
      }
    } else if(object instanceof Species) {
      var list = [];
      for(let agent of this.agents) {
        if(agent.species != object) {
          list.push(agent);
        }
      }
      this.agents = list;
    } else if(object instanceof Array) {
      for(let piece of object) {
        this.remove(piece);
      }
    }
  }
}
