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
    user_password = hashlib.sha256(body['password'].encode("utf-8")).hexdigest()
    user = User(first_name = first_name, last_name = last_name, email = user_email, user_name = user_name, password = user_password, is_active=True)

    db.session.add(user)
    db.session.commit()

    return jsonify("User created"), 200

@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    user_email = body['email']
    user_password = hashlib.sha256(body['password'].encode("utf-8")).hexdigest()
    user = User.query.filter_by(email = user_email).first()
    if user and user.password == user_password:
        access_token = create_access_token(identity = user.email)
        return jsonify(access_token = access_token, user = user.serialize()), 200
    else:
        return jsonify("User not found"), 400

@api.route('/private', methods=['GET'])
@jwt_required()
def handle_get_user():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email = user_email).first()
    return jsonify(user.serialize()), 200

# put/get Bio
@api.route('/update_bio', methods=['PUT'])
@jwt_required()
def handle_put_bio():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email = user_email).first()
    
    data = request.get_json()
    user.user_bio = data.get('user_bio', '')
    db.session.commit()

    return jsonify({'message': 'Bio updated'}), 200

@api.route('/get_bio', methods=['GET'])
@jwt_required()
def handle_get_bio():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email = user_email).first()
  
    if user and user.user_bio != None:        
        return jsonify({'user_bio': user.user_bio}), 200

    return jsonify({user.user_bio}), 200


# put/get Image
@api.route('/update_image', methods=['PUT'])
@jwt_required()
def handle_put_image():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email = user_email).first()
    
    data = request.get_json()
    user.user_image = data.get("user_image")
    db.session.commit()

    return jsonify({'message': 'Image updated'}), 200

@api.route('/get_image', methods=['GET'])
@jwt_required()
def handle_get_image():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email = user_email).first()
  
    if user and user.user_image != None:        
        return jsonify({'user_image': user.user_image}), 200

    return jsonify({user.user_image}), 200
    

# get users
@api.route('/user', methods=['GET'])
def handle_get_users():
    users = User.query.all()

    return jsonify(users), 200

@api.route('/user/favorites', methods=['GET'])
def handle_user_favs():
    body = request.get_json()
    user_name = body['user_name']

    user = User.query.filter_by(user_name = user_name)
    favorites = user['favorites']
    watch_later = user['watch_later']

    return jsonify(favorites, watch_later), 200


# Reviews GET/POST/DELETE
@api.route('/reviews', methods=['GET'])
def handle_get_reviews():
    reviews = Reviews.query.all().first()

    return jsonify(reviews), 200

@api.route('/reviews/<int:reviews_id>', methods=['GET'])
def handle_get_each_review(review_id):
    review = Reviews.query.filter_by(id = review_id).first() 

    return jsonify(review), 200

@api.route('/reviews/<int:reviews_id>', methods=['POST'])
def handle_fav_review(review_id):
    body = request.get_json()
    user_name = body['user_name']
    
    review_fav = Favorites(user_name = user_name, review_id = review_id, comment_id = None, tag_id = None, show_id = None)
    db.session.add(review_fav)
    db.session.commit()

    return jsonify('Review favorite has been created'), 200

@api.route('/reviews/<int:reviews_id>', methods=['DELETE'])
def handle_delete_fav_review(review_id):
    body = request.get_json()
    user_name = body['user_name']

    fav = Favorites.query.filter_by(user_name = user_name, review_id = review_id).first()
        
    db.session.delete(fav)
    db.session.commit()

    return jsonify('Review favorite has been removed'), 200


# Comments GET/POST/DELETE
@api.route('/comments', methods=['GET'])
def handle_get_comments():
    comments = Comments.query.all().first()

    return jsonify(comments), 200

@api.route('/comments/<int:comments_id>', methods=['GET'])
def handle_get_each_comment(comment_id):
    comment = Comments.query.filter_by(id = comment_id).first() 

    return jsonify(comment), 200

@api.route('/comments/<int:comments_id>', methods=['POST'])
def handle_fav_comment(comment_id):
    body = request.get_json()
    user_name = body['user_name']
    
    comment_fav = Favorites(user_name = user_name, comment_id = comment_id, review_id = None, tag_id = None, show_id = None)
    db.session.add(comment_fav)
    db.session.commit()

    return jsonify('Comment favorite has been created'), 200

@api.route('/comments/<int:comments_id>', methods=['DELETE'])
def handle_delete_fav_comment(comment_id):
    body = request.get_json()
    user_name = body['user_name']

    fav = Favorites.query.filter_by(user_name = user_name, comment_id = comment_id).first()
        
    db.session.delete(fav)
    db.session.commit()

    return jsonify('Comment favorite has been removed'), 200


# Tags GET/POST/DELETE
@api.route('/tags', methods=['GET'])
def handle_get_tags():
    tags = Tags.query.all().first()

    return jsonify(tags), 200

@api.route('/tags/<int:tags_id>', methods=['GET'])
def handle_get_each_tag(tag_id):
    tag = Tags.query.filter_by(id = tag_id).first() 

    return jsonify(tag), 200

@api.route('/tags/<int:tags_id>', methods=['POST'])
def handle_fav_tag(tag_id):
    body = request.get_json()
    user_name = body['user_name']
    
    tag_fav = Favorites(user_name = user_name, tag_id = tag_id, review_id = None, comment_id = None, show_id = None)
    db.session.add(tag_fav)
    db.session.commit()

    return jsonify('Tag favorite has been created'), 200

@api.route('/tags/<int:tags_id>', methods=['DELETE'])
def handle_delete_fav_tag(tag_id):
    body = request.get_json()
    user_name = body['user_name']

    fav = Favorites.query.filter_by(user_name = user_name, tag_id = tag_id).first()
        
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
    show = Shows.query.filter_by(id = show_id).first() 

    return jsonify(show), 200

@api.route('/shows/<int:shows_id>', methods=['POST'])
def handle_fav_show(show_id):
    body = request.get_json()
    user_name = body['user_name']
    
    show_fav = Favorites(user_name = user_name, show_id = show_id, review_id = None, comment_id = None, tag_id = None)
    db.session.add(show_fav)
    db.session.commit()

    return jsonify('Show favorite has been created'), 200

@api.route('/shows/<int:shows_id>', methods=['DELETE'])
def handle_delete_fav_show(show_id):
    body = request.get_json()
    user_name = body['user_name']

    fav = Favorites.query.filter_by(user_name = user_name, show_id = show_id).first()
        
    db.session.delete(fav)
    db.session.commit()

    return jsonify('Show favorite has been removed'), 200


# Watch_Later GET/POST/DELETE
@api.route('/shows/<int:shows_id>', methods=['GET'])
def handle_get_watch_later(watch_later_id):
    watch_show_later = Shows.query.filter_by(id = watch_later_id).first() 

    return jsonify(watch_show_later), 200

@api.route('/shows/<int:shows_id>', methods=['POST'])
def handle_save_show(watch_later_id):
    body = request.get_json()
    user_name = body['user_name']
    
    watch_later = Watches(user_name = user_name, watch_later_id = watch_later_id, continue_watching_id = None)
    db.session.add(watch_later)
    db.session.commit()

    return jsonify('Watch later has been created'), 200

@api.route('/shows/<int:shows_id>', methods=['DELETE'])
def handle_delete_saved_show(watch_later_id):
    body = request.get_json()
    user_name = body['user_name']

    watch_later = Watches.query.filter_by(user_name = user_name, watch_later_id = watch_later_id).first()
        
    db.session.delete(watch_later)
    db.session.commit()

    return jsonify('Watch Later has been removed'), 200


# Continue_Watching GET/POST/DELETE
@api.route('/shows/<int:shows_id>', methods=['GET'])
def handle_get_watched_show(continue_watching_id):
    continue_watching = Shows.query.filter_by(id = continue_watching_id).first() 

    return jsonify(continue_watching), 200

@api.route('/shows/<int:shows_id>', methods=['POST'])
def handle_continue_watching(continue_watching_id):
    body = request.get_json()
    user_name = body['user_name']
    
    continue_watching = Watches(user_name = user_name, continue_watching_id = continue_watching_id, watch_later_id = None)
    db.session.add(continue_watching)
    db.session.commit()

    return jsonify('Continue watching has been created'), 200

@api.route('/shows/<int:shows_id>', methods=['DELETE'])
def handle_delete_continue_watching(continue_watching_id):
    body = request.get_json()
    user_name = body['user_name']

    continue_watching = Watches.query.filter_by(user_name = user_name, continue_watching_id = continue_watching_id).first()
        
    db.session.delete(continue_watching)
    db.session.commit()

    return jsonify('Continue watching has been removed'), 200