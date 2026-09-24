class Evaluator:

    def evaluate(self, answer: str):

        if len(answer) > 80:
            return 8, "Good detailed answer."

        return 4, "Answer is too short."
