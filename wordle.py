from collections import defaultdict

from wordle_list import words


def is_possible(word: str, incorrect: list, wrong_pos: dict, correct: dict) -> bool:
    if any(letter in word for letter in incorrect):
        return False
    elif any(word[idx] != letter for letter, idx in correct.items()):
        return False
    elif any(
        any([word[idx] == letter for idx in indexes])
        for letter, indexes in wrong_pos.items()
    ):
        return False
    elif any(letter not in word for letter in wrong_pos):
        return False
    else:
        return True


def get_possible_words(letters: list[dict]) -> list:
    results = []
    rows = []
    for i in range(6):
        start = i * 5
        rows.append(letters[start: start + 5])

    incorrect = []
    wrong_pos = defaultdict(list)
    correct = {}

    for letter in letters:
        if int(letter["state"]) == 0:
            incorrect += letter["value"]
        elif int(letter["state"]) == 2:
            correct[letter["value"]] = int(letter["id"]) % 5
        elif int(letter["state"]) == 1:
            wrong_pos[letter["value"]].append(int(letter["id"]) % 5)

    for word in words:
        if is_possible(word, incorrect, wrong_pos, correct):
            results.append(word)

    return results
