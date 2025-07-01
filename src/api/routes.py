"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Favorites, Reviews, Comments, Tags, Shows, Watches
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import hashlib

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# getUser/ login info


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    first_name = body['first_name']
    last_name = body['last_name']
    user_email = body['email']
    user_name = body['user_name']
    user_password = hashlib.sha256(
        body['password'].encode("utf-8")).hexdigest()
    user = User(first_name=first_name, last_name=last_name, email=user_email,
                user_name=user_name, password=user_password, is_active=True)

    db.session.add(user)
    db.session.commit()

    return jsonify("User created"), 200


@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    user_email = body['email']
    user_password = hashlib.sha256(
        body['password'].encode("utf-8")).hexdigest()
    user = User.query.filter_by(email=user_email).first()
    if user and user.password == user_password:
        access_token = create_access_token(identity=user.email)
        return jsonify(access_token=access_token, user=user.serialize()), 200
    else:
        return jsonify("User not found"), 400
    
# @api.route('/request-reset', methods=['POST'])
# def request_reset():
#     data = request.get_json()
#     user_email = data.get("email")
    

# @api.route('/reset-password', methods=['POST'])
# def handle_login():


@api.route('/private', methods=['GET'])
@jwt_required()
def handle_get_user():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    return jsonify(user.serialize()), 200

# put/get Bio


@api.route('/update_bio', methods=['PUT'])
@jwt_required()
def handle_put_bio():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    data = request.get_json()
    user.user_bio = data.get('user_bio', '')
    db.session.commit()

    return jsonify({'message': 'Bio updated'}), 200


@api.route('/get_bio', methods=['GET'])
@jwt_required()
def handle_get_bio():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if user and user.user_bio != None:
        return jsonify({'user_bio': user.user_bio}), 200

    return jsonify({user.user_bio}), 200


# put/get Image
@api.route('/update_image', methods=['PUT'])
@jwt_required()
def handle_put_image():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    data = request.get_json()
    user.user_image = data.get("user_image")
    db.session.commit()

    return jsonify({'message': 'Image updated'}), 200


@api.route('/get_image', methods=['GET'])
@jwt_required()
def handle_get_image():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if user and user.user_image != None:
        return jsonify({'user_image': user.user_image}), 200

    return jsonify({user.user_image}), 200

# get account users


@api.route('/user', methods=['GET'])
def handle_get_users():
    users = User.query.all()

    return jsonify(users), 200

# Post/Get userFavs


@api.route('/user/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    data = request.get_json()
    movie_id = data.get('movie_id')
    show_id = data.get('show_id')
    review_id=data.get("review_id"),
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    movie = db.session.get(movie_id)
    if not movie:
        movie = movie(id=movie_id)
        db.session.add(movie)
        db.session.commit()
        return movie    
    show = db.session.get(show_id)
    if not show:
        show = show(id=movie_id)
        db.session.add(show)
        db.session.commit()
        return show    
    review = db.session.get(review_id)
    if not review:
        review = review(id=movie_id)
        db.session.add(review)
        db.session.commit()
        return review    

    new_favorite = Favorites(
        user_name=user.user_name,
        review_id=data.get("review_id"),
        comment_id=data.get("comment_id"),
        tag_id=data.get("tag_id"),
        show_id=data.get("show_id"),
        movie_id=data.get("movie_id")
    )

    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({"message": "Favorite added", "favorite": new_favorite.serialize()}), 201


@api.route('/user/favorites', methods=['GET'])
@jwt_required()
def handle_get_user_favs():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    print(user.favorites)

    if not user:
        return jsonify({"error": "User not found"}), 404

    favorites = [fav.serialize() for fav in user.favorites]

    return jsonify({
        "favorites": favorites
    }), 200

# put/get userWatches


@api.route('/user/watches', methods=['PUT'])
@jwt_required()
def handle_put_user_watch():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    data = request.get_json()
    user.watches = data.get('watches', '')
    db.session.commit()

    return jsonify({'message': 'Watch list updated'}), 200


@api.route('/user/watches', methods=['GET'])
@jwt_required()
def handle_get_user_watchList():
    body = request.get_json()
    user_name = body['user_name']

    user = User.query.filter_by(user_name=user_name).first()

    if user and user.watches != None:
        return jsonify({'watches': user.watches}), 200

    return jsonify({user.watches}), 200


# Reviews GET/POST/PUT/DELETE
@api.route('/reviews/<item_type>/<int:id>', methods=['POST'])
@jwt_required()
def reviews(item_type, id):
    data = request.get_json()
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    data['user_id'] = user.id
    data['user_name'] = user.user_name

    required_fields = ["user_id", "user_name",
                       "itemId", "itemType", "text", "rating"]
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    if not isinstance(data["rating"], int) or not (0 <= data["rating"] <= 10):
        return jsonify({"error": "Rating must be an integer between 0 and 10"}), 400

    item_id = id
    item_type = item_type
    text = data.get("text")
    rating = data.get("rating")

    # Find existing review or create new
    new_review = Reviews(user_id=user.id, user_name=user.user_name, item_id=item_id,
                         item_type=item_type, text=text, rating=rating)
    db.session.add(new_review)
    db.session.commit()

    return jsonify(success=True)


@api.route('/reviews/movie/<int:item_id>', methods=['GET'])
def get_movie_reviews(item_id):
    reviews = Reviews.query.filter_by(item_id=item_id, item_type='movie').all()
    return jsonify([r.serialize() for r in reviews])


@api.route('/reviews/series/<int:series_id>', methods=['GET'])
def get_series_reviews(series_id):
    reviews = Reviews.query.filter_by(
        item_id=series_id, item_type='series').all()
    return jsonify([r.serialize() for r in reviews])


@api.route('/user/review', methods=['PUT'])
@jwt_required()
def put_review():
    user_id = get_jwt_identity()
    data = request.get_json()
    item_id = data.get("itemId")
    item_type = data.get("itemType")
    text = data.get("text")
    rating = data.get("rating")

    # Find existing review or create new
    review = Reviews.query.filter_by(
        user_id=user_id, item_id=item_id, item_type=item_type).first()
    if review:
        review.text = text
        review.rating = rating
    else:
        review = Reviews(user_id=user_id, item_id=item_id,
                         item_type=item_type, text=text, rating=rating)
        db.session.add(review)
    db.session.commit()
    return jsonify(review.serialize()), 200


# # GET comments for a review/ POST a comment
# @api.route("/reviews/<item_type>/<int:item_id>/comments")
# def get_comments(item_type, item_id):
    # review_id = request.args.get("review_id")
    # comments = Comments.query.filter_by(review_id=review_id).all()
    # return jsonify([c.serialize() for c in comments])

@api.route("/reviews/<item_type>/<int:item_id>/comments", methods=["POST"])
def post_comment(item_type, item_id):
    data = request.get_json()
    comment = Comments(
        review_id=data["review_id"],
        user_name=data["user_name"],
        text=data["text"])
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.serialize()), 201

# Tags GET/POST/DELETE


@api.route('/tags', methods=['GET'])
def handle_get_tags():
    tags = Tags.query.all().first()

    return jsonify(tags), 200


@api.route('/tags/<int:tags_id>', methods=['GET'])
def handle_get_each_tag(tag_id):
    tag = Tags.query.filter_by(id=tag_id).first()

    return jsonify(tag), 200


@api.route('/tags/<int:tags_id>', methods=['POST'])
def handle_fav_tag(tag_id):
    body = request.get_json()
    user_name = body['user_name']

    tag_fav = Favorites(user_name=user_name, tag_id=tag_id,
                        review_id=None, comment_id=None, show_id=None)
    db.session.add(tag_fav)
    db.session.commit()

    return jsonify('Tag favorite has been created'), 200


@api.route('/tags/<int:tags_id>', methods=['DELETE'])
def handle_delete_fav_tag(tag_id):
    body = request.get_json()
    user_name = body['user_name']

    fav = Favorites.query.filter_by(user_name=user_name, tag_id=tag_id).first()

    db.session.delete(fav)
    db.session.commit()

    return jsonify('Tag favorite has been removed'), 200


# Shows GET/POST/DELETE
@api.route('/shows', methods=['GET'])
def handle_get_shows():
    shows = Shows.query.all().first()

    return jsonify(shows), 200


@api.route('/shows/<int:shows_id>', methods=['GET'])
def handle_get_each_show(show_id):
    show = Shows.query.filter_by(id=show_id).first()

    return jsonify(show), 200


@api.route('/shows/<int:shows_id>', methods=['POST'])
def handle_fav_show(show_id):
    body = request.get_json()
    user_name = body['user_name']

    show_fav = Favorites(user_name=user_name, show_id=show_id,
                         review_id=None, comment_id=None, tag_id=None)
    db.session.add(show_fav)
    db.session.commit()

    return jsonify('Show favorite has been created'), 200


@api.route('/shows/<int:shows_id>', methods=['DELETE'])
def handle_delete_fav_show(show_id):
    body = request.get_json()
    user_name = body['user_name']

    fav = Favorites.query.filter_by(
        user_name=user_name, show_id=show_id).first()

    db.session.delete(fav)
    db.session.commit()

    return jsonify('Show favorite has been removed'), 200


# Watch_Later GET/POST/DELETE
@api.route('/shows/<int:shows_id>', methods=['GET'])
def handle_get_watch_later(watch_later_id):
    watch_show_later = Shows.query.filter_by(id=watch_later_id).first()

    return jsonify(watch_show_later), 200


@api.route('/shows/<int:shows_id>', methods=['POST'])
def handle_save_show(watch_later_id):
    body = request.get_json()
    user_name = body['user_name']

    watch_later = Watches(
        user_name=user_name, watch_later_id=watch_later_id, continue_watching_id=None)
    db.session.add(watch_later)
    db.session.commit()

    return jsonify('Watch later has been created'), 200


@api.route('/shows/<int:shows_id>', methods=['DELETE'])
def handle_delete_saved_show(watch_later_id):
    body = request.get_json()
    user_name = body['user_name']

    watch_later = Watches.query.filter_by(
        user_name=user_name, watch_later_id=watch_later_id).first()

    db.session.delete(watch_later)
    db.session.commit()

    return jsonify('Watch Later has been removed'), 200


# Continue_Watching GET/POST/DELETE
@api.route('/shows/<int:shows_id>', methods=['GET'])
def handle_get_watched_show(continue_watching_id):
    continue_watching = Shows.query.filter_by(id=continue_watching_id).first()

    return jsonify(continue_watching), 200


@api.route('/shows/<int:shows_id>', methods=['POST'])
def handle_continue_watching(continue_watching_id):
    body = request.get_json()
    user_name = body['user_name']

    continue_watching = Watches(
        user_name=user_name, continue_watching_id=continue_watching_id, watch_later_id=None)
    db.session.add(continue_watching)
    db.session.commit()

    return jsonify('Continue watching has been created'), 200


@api.route('/shows/<int:shows_id>', methods=['DELETE'])
def handle_delete_continue_watching(continue_watching_id):
    body = request.get_json()
    user_name = body['user_name']

    continue_watching = Watches.query.filter_by(
        user_name=user_name, continue_watching_id=continue_watching_id).first()

    db.session.delete(continue_watching)
    db.session.commit()

    return jsonify('Continue watching has been removed'), 200
