import Tree from 'arboreal.js';
import { isArray } from 'lodash';

class ParallelQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(promise) { this.queue.push(promise); }

  isEmpty() { return this.queue.length === 0; }

  flush() { this.queue = []; }
}

function isLastChild(node) {
  const siblings = node.parent && node.parent.children;
  return node.parent === null || siblings[siblings.length - 1].id === node.id;
}

function isFirstChild(node) {
  const siblings = node.parent && node.parent.children;
  return node.parent === null || siblings[0].id === node.id;
}

function isSequence(node) { return node.depth === 1; }

function isParallel(node) { return node.depth === 2; }

const queueInstance = {
  tree: new Tree(),
  init() {
    this.sequence(() => Promise.resolve(null));
    return this;
  },
  sequence(promise) {
    const node = this.tree.find(isLastChild);
    node.appendChild(promise);
    return this;
  },
  parallel(promise) {
    const node = this.tree.find(isFirstChild);
    node.children[node.children.length - 1].appendChild(promise);
    return this;
  },
  resolveTree() {
    const queue = [];
    const parallelQueue = new ParallelQueue();
    this.tree.traverseDown((node) => {
      const promise = node.data;

      if (node.isRoot()) { return; }

      if (isSequence(node)) {
        queue.push(promise);
        parallelQueue.flush();
      } else if (isParallel(node)) {
        parallelQueue.enqueue(promise);
      }

      if (!parallelQueue.isEmpty() && isLastChild(node)) {
        queue.push(parallelQueue.queue);
        parallelQueue.flush();
      }
    });

    return queue;
  },
  flush() {
    this.tree = new Tree();
  },
  async exec() {
    const queue = this.resolveTree();
    const res = queue
      .reduce(async (acc, q) => {
        const input = await acc;
        if (isArray(q)) {
          return Promise.all(q.map(f => f(input)));
        }
        return q(input);
      }, Promise.resolve(null));

    this.flush();
    this.init();

    return res;
  },
};

export default queueInstance.init();
