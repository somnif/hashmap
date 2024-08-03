import Node from "./NodeItem.js";

export default class HashMap {
  constructor() {
    this.ratio = 0.75;
    this.bucket = new Array(16);
    this.bucketLength = 0;
  }

  hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
      hashCode = hashCode % this.bucket.length;
    }

    return hashCode;
  }

  findNode(key) {
    const keyHash = this.hash(key);

    const getKey = (node) => {
      if (node && node.key === key) {
        return node;
      } else if (node && node.nextNode) {
        return getKey(node.nextNode);
      } else {
        return null;
      }
    };

    return getKey(this.bucket[keyHash]);
  }

  grow() {
    if (this.bucketLength / this.bucket.length > this.ratio) {
      const pulledValues = this.entries();
      this.bucket = new Array(this.bucket.length * 2);
      this.bucketLength = 0;
      pulledValues.forEach(([key, value]) => {
        this.set(key, value);
      });
    }
  }

  set(key, value) {
    const keyHash = this.hash(key);

    const finalNode = (node = this.bucket[keyHash]) => {
      return node.nextNode ? finalNode(node.nextNode) : node;
    };

    if (!this.bucket[keyHash]) {
      this.bucket[keyHash] = new Node(key, value);
      this.bucketLength++;
      return `Added Node to Bucket ${keyHash}`;
    } else if (this.findNode(key)) {
      this.findNode(key).value = value;
      return `Edited Node in Bucket ${keyHash}`;
    } else {
      finalNode().nextNode = new Node(key, value);
      this.bucketLength++;
      this.grow();
      return `Append Node to the end of Bucket ${keyHash}`;
    }
  }

  get(key) {
    const node = this.findNode(key);
    return !node ? null : node.value;
  }

  has(key) {
    return this.findNode(key) ? true : false;
  }

  remove(key) {
    const keyHash = this.hash(key);
    const getPrevNode = (node = this.bucket[keyHash]) => {
      if (node.key === key) {
        return null;
      } else if (node.nextNode.key === key) {
        return node;
      } else {
        getPrevNode(node.nextNode);
      }
    };

    const currentNode = this.findNode(key);
    const prevNode = getPrevNode();

    if (!currentNode) {
      return false;
    } else if (prevNode) {
      prevNode.nextNode = currentNode.nextNode;
      this.bucketLength--;
      return `Removed node from middle of bucket.`;
    } else {
      this.bucket[keyHash] = null;
      this.bucketLength--;
      return `Removed only node in bucket.`;
    }
  }

  clear() {
    this.bucket = new Array(16);
    this.bucketLength = 0;
  }

  length() {
    return this.bucketLength;
  }

  getAll() {
    const allItems = [];

    const pushInfo = (node) => {
      const { key, value } = node;
      allItems.push({ key, value });
      if (node.nextNode) {
        pushInfo(node.nextNode);
      }
    };

    this.bucket.forEach((bucketIndex) => {
      if (bucketIndex) {
        pushInfo(bucketIndex);
      }
    });

    return allItems;
  }

  keys() {
    return this.getAll().map((item) => item.key);
  }

  values() {
    return this.getAll().map((item) => item.value);
  }

  entries() {
    return this.getAll().map((item) => [item.key, item.value]);
  }
}
