export const problems = [
  {
    id: "move-zeros-to-end",
    title: "Move All Zeros to End",
    difficulty: "Easy",
    topic: "Arrays",
    statement: "Given an array of integers, move all zeros to the end of the array while maintaining the relative order of the non-zero elements.",
    constraints: "- You must do this in-place without making a copy of the array.\n- Minimize the total number of operations.",
    sample_input: "[0,1,0,3,12]",
    sample_output: "[1,3,12,0,0]",
    explanation: "After moving all the 0s to the end, the non-zero elements 1, 3, 12 maintain their original order.",
    hints: "1. Can you use a two-pointer approach?\n2. Keep track of the position of the last non-zero element found so far.",
    starterCode: {
      python: "def moveZeros(nums):\n    # Write your code here\n    pass",
    },
    publicTestCases: [
      { id: 1, name: "Example 1", input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
      { id: 2, name: "Empty array", input: [[]], expected: [] },
      { id: 3, name: "No zeros", input: [[1, 2, 3]], expected: [1, 2, 3] },
    ],
    hiddenTestCases: [
      { id: "h1", input: [[0, 0, 0, 1]], expected: [1, 0, 0, 0] },
      { id: "h2", input: [[1]], expected: [1] },
      { id: "h3", input: [[0]], expected: [0] },
    ],
  },
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    statement: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    constraints: "- Each input would have exactly one solution.\n- You may not use the same element twice.",
    sample_input: "nums = [2,7,11,15], target = 9",
    sample_output: "[0,1]",
    explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    hints: "1. A brute force solution is O(n^2). Can you do better?\n2. Try using a hash map to store the elements you have seen so far.",
    starterCode: {
      python: "def twoSum(nums, target):\n    # Write your code here\n    pass",
    },
    publicTestCases: [
      { id: 1, name: "Example 1", input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { id: 2, name: "Example 2", input: [[3, 2, 4], 6], expected: [1, 2] },
      { id: 3, name: "Same elements", input: [[3, 3], 6], expected: [0, 1] },
    ],
    hiddenTestCases: [
      { id: "h1", input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
      { id: "h2", input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 19], expected: [8, 9] },
    ],
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    topic: "Strings",
    statement: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
    constraints: "- 1 <= s.length <= 2 * 10^5\n- s consists only of printable ASCII characters.",
    sample_input: '"A man, a plan, a canal: Panama"',
    sample_output: "true",
    explanation: '"amanaplanacanalpanama" is a palindrome.',
    hints: "1. How can you remove non-alphanumeric characters easily in Python?\n2. You can use two pointers, one at the start and one at the end.",
    starterCode: {
      python: "def isPalindrome(s):\n    # Write your code here\n    pass",
    },
    publicTestCases: [
      { id: 1, name: "Example 1", input: ["A man, a plan, a canal: Panama"], expected: true },
      { id: 2, name: "Example 2", input: ["race a car"], expected: false },
      { id: 3, name: "Empty string", input: [" "], expected: true },
    ],
    hiddenTestCases: [
      { id: "h1", input: ["0P"], expected: false },
      { id: "h2", input: ["a."], expected: true },
    ],
  }
];
