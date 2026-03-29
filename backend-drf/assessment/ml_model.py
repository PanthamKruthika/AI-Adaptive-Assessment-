from sklearn.ensemble import RandomForestClassifier

X = [
    [1,1,1],[1,1,2],[1,1,3],[1,1,4],
    [0,1,1],[0,1,2],[0,1,3],[0,1,4],
    [1,0,1],[1,0,2],[1,0,3],
    [0,0,1],[0,0,2],
    [1,2,1],[1,2,2],[1,2,3],
    [0,2,1],[0,2,2],[0,2,3],
    [1,1,5],[0,1,5],
    [1,2,4],[0,2,4],
    [1,0,4],[0,0,3]
]

y = [
    2,2,2,2,
    0,0,0,0,
    1,1,1,
    0,0,
    2,2,2,
    1,1,1,
    2,0,
    2,1,
    1,0
]

model = RandomForestClassifier(n_estimators=100)
model.fit(X, y)

difficulty_map = {"easy":0,"medium":1,"hard":2}
reverse_map = {0:"easy",1:"medium",2:"hard"}

def predict_next(correct, current_difficulty, question_number):
    diff = difficulty_map[current_difficulty]
    prediction = model.predict([[correct, diff, question_number]])
    return reverse_map[prediction[0]]