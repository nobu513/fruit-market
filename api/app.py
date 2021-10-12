from flask import Flask, render_template, request, redirect, jsonify
from datetime import datetime
import yaml
import mysql.connector
from flask_cors import CORS

app = Flask(__name__, static_folder="frontend")
cors = CORS(app)

try:

    with open("db.yaml") as file:
        content = yaml.load(file)
        host = content["mysql_host"]
        user = content["mysql_user"]
        pw = content["mysql_password"]
        database = content["mysql_db"]
except:
    print("database config are neccessary.")


cnx = mysql.connector.connect(
    user=user,
    password=pw,
    host=host,
    database=database
)
cursor = cnx.cursor()


@app.route('/fruits', methods=['POST', 'GET'])
def index():
    query = "select * from fruit order by id desc"
    cursor.execute(query)
    data = cursor.fetchall()
    json_data = []
    # ここらへんはMarshmallowみたいなシリアライザーを使えばもっときれいにかけそう。
    for d in data:
        json_data.append({"id": d[0], "name": d[1], "price": d[2]})
    return jsonify(json_data)


@app.route("/create", methods=["POST"])
def create():
    if request.method == "POST":
        name = request.json["name"]
        price = request.json["price"]
        query = "insert into fruit (name, price) values (%s, %s)"
        cursor.execute(query, (name, price))
        cnx.commit()
    return "success"


@app.route("/delete/<int:id>", methods=["DELETE"])
def delete(id):
    query = "delete from fruit where id=%s"
    cursor.execute(query, (id,))
    cnx.commit()
    return "success"


@app.route("/update/<int:id>", methods=["PUT"])
def update(id):
    query = "update fruit set name=%s, price=%s where id=%s"
    name = request.json["name"]
    price = request.json["price"]
    cursor.execute(query, (name, price, id))
    cnx.commit()
    return "success"


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
