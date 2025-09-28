from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

pattern = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
]

def reset_pattern():
    global pattern
    pattern = [[0 for _ in range(3)] for _ in range(3)]

def win_condition(row_index,column_index,shape):
    if shape == "Cross":
        shape_num = 1
    else:
        shape_num = 2
    
    if all(value == shape_num for value in pattern[row_index]):
        reset_pattern()
        return jsonify({"server_status": "Ok", "win_status": shape})
    if all(row[column_index] == shape_num for row in pattern):
        reset_pattern()
        return jsonify({"server_status": "Ok", "win_status": shape})
    if all(pattern[i][i] == shape_num for i in range(3)):
        reset_pattern()
        return jsonify({"server_status": "Ok", "win_status": shape})
    if all(pattern[i][2-i] == shape_num for i in range(3)):
        reset_pattern()
        return jsonify({"server_status": "Ok", "win_status": shape})
    elif not any(0 in row for row in pattern):
        reset_pattern()
        return jsonify({"server_status": "Ok", "win_status": "Tie"})
    
    return jsonify({"server_status": "Ok", "win_status": "None"})


@app.route("/")
def call_html():
    return render_template("tic_tac_toe.html")

@app.route("/send_cross_index", methods = ["POST"])
def recieve_cross_data ():
    data = request.get_json()
    index = data.get("index")
    row_index = index//3
    column_index = index%3
    print(column_index)
    pattern[row_index][column_index] = 1
    return win_condition(row_index,column_index,"Cross")


@app.route("/send_ring_index", methods  = ["POST"])
def recieve_ring_data():
    data = request.get_json()
    index = data.get("index")
    row_index = index//3
    column_index = index%3
    pattern[row_index][column_index] = 2
    return win_condition(row_index,column_index,"Ring")

if __name__ == "__main__":
    app.run(debug=True)