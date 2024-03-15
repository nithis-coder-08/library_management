from application import app
from flask import request, jsonify
from application import db
from bson import ObjectId
import requests
from datetime import date, datetime
import urllib.parse


db.members.create_index([("username", 1)], unique=True)


def append_url(api_url, title):
    if not title:
        return api_url
    encoded_borrowed_title = urllib.parse.quote(title)
    updated_url = f"{api_url}?title={encoded_borrowed_title}"
    return updated_url


def append_filterurl(api_url, title, page, authors):

    enocoded_title = urllib.parse.quote(str(title))
    encoded_authors = urllib.parse.quote(str(authors))
    encoded_page = urllib.parse.quote(str(page))
    updated_url = f"{api_url}?title={enocoded_title}&page={encoded_page}&authors={encoded_authors}"
    return updated_url


@app.route("/")
def index():
    return "Hello, stanch!"


@app.route("/members", methods=["POST", "GET"])
def members():
    if request.method == "POST":
        data = request.get_json()
        name = data.get("name")
        phone = data.get("phone")
        if not name or not phone:
            return jsonify({"error": "Name and phone are required"}), 400
        existing_member = db.members.find_one({"phone": phone}) or db.members.find_one(
            {"username": name}
        )
        if existing_member:
            return jsonify({"error": "Phone number or Username already exists"}), 400
        new_member = {
            "username": name,
            "phone": phone,
            "borrowed_title": data.get("borrowed_title", ""),
            "borrowed_on": data.get("borrowed_on", "    "),
            "debt": data.get("debt", 0.0),
        }
        db.members.insert_one(new_member)
        return jsonify({"message": "Member created successfully"}), 201

    elif request.method == "GET":
        membersList = []
        for member in db.members.find().sort("name", 1):
            member["_id"] = str(member["_id"])
            membersList.append(member)
        return jsonify(membersList)


@app.route("/members/<string:username>", methods=["GET"])
def get_member(username):
    member = db.members.find_one({"username": username})
    if not member:
        return jsonify({"error": "Member not found"}), 404
    member["_id"] = str(member["_id"])
    return jsonify({"member": member})


@app.route("/members/<string:username>", methods=["PUT"])
def update_member(username):
    data = request.get_json()
    update_fields = {}
    if "username" in data:
        update_fields["username"] = data["username"]
    if "phone" in data:
        update_fields["phone"] = data["phone"]
    if "debt" in data:
        update_fields["debt"] = data["debt"]
    if not update_fields:
        return jsonify({"error": "No fields provided for update"}), 400
    result = db.members.update_one({"username": username}, {"$set": update_fields})
    if result.matched_count == 0:
        return jsonify({"error": "Member not found"}), 404

    return jsonify({"message": "Member updated successfully"})


@app.route("/members/<string:username>", methods=["DELETE"])
def delete_member(username):
    result = db.members.delete_one({"username": username})
    if result.deleted_count == 0:
        return jsonify({"error": "Member not found"}), 404
    return jsonify({"message": "Member deleted successfully"})


@app.route("/members/borrow", methods=["PUT"])
def borrowBook():
    data = request.get_json()
    username = data.get("username")
    if not username:
        return jsonify({"error": "username is required"}), 400
    member = db.members.find_one({"username": username})
    if not member:
        return jsonify({"error": "Member not found"}), 404
    borrowed_title = data.get("borrowed_title")
    currDebt = member["debt"]
    if currDebt >= 500:
        return jsonify({"error": "Member has outstanding debt"}), 400
    if not borrowed_title:
        return jsonify({"error": "borrowed_title is required"}), 400

    alreadyBorrowed = db.members.find_one({"borrowed_title": borrowed_title})
    if alreadyBorrowed or member["borrowed_title"] != "":
        return jsonify({"error": "Book already borrowed by another member"}), 400

    book_api_url = append_url(
        "https://frappe.io/api/method/frappe-library", borrowed_title
    )
    # return book_api_url
    response = requests.get(book_api_url)
    if response.status_code == 200:
        books = response.json()
        if not books:
            return jsonify({"error": "No books found"}), 404
        borrowed_on = date.today().strftime("%d-%m-%Y")
        res = db.members.update_one(
            {"username": username},
            {"$set": {"borrowed_title": borrowed_title, "borrowed_on": borrowed_on}},
        )
        transactionData = {
            "username": username,
            "borrowed_title": borrowed_title,
            "borrowed_on": borrowed_on,
            "returned_on": "",
            "rent": 0.0,
            "duration": 0,
        }
        tRes = db.transactions.insert_one(transactionData)
        if res.modified_count == 0 or tRes.inserted_id is None:
            return jsonify({"error": "Member not found or failed to borrow"}), 404
        return jsonify({"message": "Book borrowed successfully"})

    else:
        return jsonify({"error": "Failed to fetch data from the API"}), 500


@app.route("/members/return", methods=["PUT"])
def bookReturn():
    data = request.get_json()
    username = data.get("username")
    if not username:
        return jsonify({"error": "username is required"}), 400
    borrowed_title = data.get("borrowed_title")
    member = db.members.find_one({"username": username})
    if not member:
        return jsonify({"error": "Member not found"}), 404
    if borrowed_title != member["borrowed_title"]:
        return jsonify({"error": "Book not borrowed by this member"}), 400

    returned_date = date.today().strftime("%d-%m-%Y")
    borrowed_date = member["borrowed_on"]
    duration = (
        datetime.strptime(returned_date, "%d-%m-%Y")
        - datetime.strptime(borrowed_date, "%d-%m-%Y")
    ).days
    rent = duration * 20 if duration > 0 else 20
    currentDebt = member["debt"]
    res = db.members.update_one(
        {"username": username},
        {"$set": {"borrowed_title": "", "borrowed_on": "", "debt": currentDebt + rent}},
    )
    if res.modified_count == 0:
        return jsonify({"error": "Failed to update member record"}), 500
    tRes = db.transactions.update_one(
        {"username": username, "borrowed_title": borrowed_title},
        {"$set": {"returned_on": returned_date, "duration": duration, "rent": rent}},
    )
    if tRes.matched_count == 0:
        return jsonify({"error": "Failed to update transaction record"}), 500

    return jsonify(
        {
            "message": "Book returned successfully",
            "borrowedDate": borrowed_date,
            "returnedDate": returned_date,
            "duration": duration,
        }
    )


@app.route("/transactions", methods=["GET"])
def get_transactions():
    transactionsList = []
    for transaction in db.transactions.find():
        transaction["_id"] = str(transaction["_id"])
        transactionsList.append(transaction)
    return jsonify(transactionsList)


@app.route("/transactions/<string:username>", methods=["GET"])
def get_member_transactions(username):
    transactionsList = []
    for transaction in db.transactions.find({"username": username}):
        transaction["_id"] = str(transaction["_id"])
        transactionsList.append(transaction)
    return jsonify(transactionsList)


@app.route("/books", methods=["GET"])
def getBooks():
    api_url = "https://frappe.io/api/method/frappe-library?page=2&title=and"

    response = requests.get(api_url)
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        return jsonify(data)
    else:
        return "Failed to fetch data from the API", 500


@app.route("/searchbooks", methods=["GET"])
def getSearchedBooks():
    title = request.args.get("title")
    author = request.args.get("author")
    page = request.args.get("page", default=1, type=int)
    api_url = append_filterurl( 
        "https://frappe.io/api/method/frappe-library",
        title,
        page,
        author,
    )
    # return api_url
    response = requests.get(api_url)
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        return jsonify(data)
    else:
        return "Failed to fetch data from the API", 500


@app.route("/members/pay", methods=["PUT"])
def payment():
    data = request.get_json()
    username = data.get("username")
    pay = float(data.get("payment"))
    if not username:
        return jsonify({"error": "username is required"}), 400
    if not pay:
        return jsonify({"error": "payment is required"}), 400
    member = db.members.find_one({"username": username})
    if not member:
        return jsonify({"error": "Member not found"}), 404
    currentDebt = member["debt"]
    if currentDebt < pay:
        return jsonify({"error": "Insufficient balance"}), 400
    res = db.members.update_one(
        {"username": username},
        {"$set": {"debt": currentDebt - pay}},
    )
    if res.modified_count == 0:
        return jsonify({"error": "Failed to update member record"}), 500
    return jsonify({"message": "Payment successful"}), 200
