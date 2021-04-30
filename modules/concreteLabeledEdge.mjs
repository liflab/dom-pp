class ConcreteLabeledEdge {
    constructor(node, q) {
        //super();
        this.node = node;
        q = {EXACT, OVER, UNDER, NONE};
        this.q = q;
    }

    getQuality() {
        return this.q;
    }

    getNode() {
        return this.node;
    }

    toString() {
        return this.node + ":" + this.q;
    }
}