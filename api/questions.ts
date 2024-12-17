interface Example {
  input: string;
  output: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examples: Example[];
  starterCode: string;
}

export const questions: Question[] = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers in the array that add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'easy',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1] // Because nums[0] + nums[1] == 9'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2] // Because nums[1] + nums[2] == 6'
      }
    ],
    starterCode: `function twoSum(nums, target) {
  // Your code here
}`
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: 1) Open brackets must be closed by the same type of brackets. 2) Open brackets must be closed in the correct order.',
    difficulty: 'medium',
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    starterCode: `function isValid(s) {
  // Your code here
}`
  },
  {
    id: '3',
    title: 'Merge K Sorted Lists',
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    difficulty: 'hard',
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]'
      },
      {
        input: 'lists = []',
        output: '[]'
      }
    ],
    starterCode: `function mergeKLists(lists) {
  // Your code here
}`
  }
];