class ConcreteLabeledEdge {
    constructor(node, quality) {
        //super();
        this.node = node;
        this.quality = quality;
    }

    getQuality() {
        return this.quality;
    }

    getNode() {
        return this.node;
    }

    toString() {
        return this.node + ":" + this.quality;
    }
}
class Quality {
    static EXACT = new Quality('EXACT');
    static OVER = new Quality('OVER');
    static UNDER = new Quality('UNDER');
    static NONE = new Quality('NONE');
  
    constructor(name) {
      this.name = name;
    }
    toString() {
      return `Quality.${this.name}`;
    }
  }
export {ConcreteLabeledEdge, Quality}