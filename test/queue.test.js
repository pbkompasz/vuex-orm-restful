import Queue from '@/queue';

test('initial value should be null', () => {
  const queue = Queue
    .sequence((res) => {
      expect(res).toBeNull();
    });
  queue.exec();
});

test('flushes queue after execution', async () => {
  const queue = Queue
    .sequence((res) => {
      expect(res).toBeNull();
    });
  expect(queue.tree.toString()).toBe('0 \n |- 0/0 \n |- 0/1 ');

  await queue.exec();
  expect(queue.tree.toString()).toBe('0 \n |- 0/0 ');
});

test('executes a single sequence', () => {
  const queue = Queue
    .sequence(() => Promise.resolve(1));

  expect(queue.exec()).resolves.toBe(1);
});

test('executes multiple sequences and passes results', () => {
  const queue = Queue
    .sequence((res) => {
      expect(res).toBeNull();
      return Promise.resolve(1);
    }).sequence((res) => {
      expect(res).toBe(1);
      return Promise.resolve(2);
    }).sequence((res) => {
      expect(res).toBe(2);
      return Promise.resolve(3);
    });

  expect(queue.exec()).resolves.toBe(3);
});

test('executes a single parallel', () => {
  const queue = Queue
    .parallel(() => Promise.resolve(1));

  expect(queue.exec()).resolves.toEqual([1]);
});

test('executes multiple parallels', () => {
  const queue = Queue
    .parallel(() => Promise.resolve(1))
    .parallel(() => Promise.resolve(2))
    .parallel(() => Promise.resolve(3));

  expect(queue.exec()).resolves.toEqual([1, 2, 3]);
});

test('executes multiple parallels and passes results', () => {
  const queue = Queue
    .parallel((res) => {
      expect(res).toBeNull();
      return Promise.resolve(1);
    }).parallel((res) => {
      expect(res).toBeNull();
      return Promise.resolve(2);
    }).parallel((res) => {
      expect(res).toBeNull();
      return Promise.resolve(3);
    });

  expect(queue.exec()).resolves.toEqual([1, 2, 3]);
});

test('mixes parallel and sequence', () => {
  expect(Queue
    .sequence(() => Promise.resolve(1))
    .parallel(res => Promise.resolve(res + 1))
    .parallel(res => Promise.resolve(res + 1))
    .parallel(res => Promise.resolve(res + 1))
    .sequence(res => Promise.resolve(res))
    .exec()).resolves.toEqual([2, 2, 2]);
});
