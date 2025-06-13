from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import String, Boolean, ForeignKey, Text, DateTime, func, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    user_name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    user_bio: Mapped[str] = mapped_column(String(520), nullable=True)
    # trying Text instad of String
    user_image: Mapped[str] = mapped_column(Text, nullable=True)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    favorites: Mapped[list["Favorites"]] = relationship(back_populates = "user_favorites")
    watches: Mapped[list["Watches"]] = relationship(back_populates = "user_watches")


    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "user_name": self.user_name,
            "user_bio": self.user_bio,
            "user_image": self.user_image,
            "favorites": self.favorites,
            "watches": self.watches,
            # do not serialize the password, its a security breach
        }    
    
class Favorites(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    user_name: Mapped[str] = mapped_column(ForeignKey("user.user_name"))
    user_favorites: Mapped["User"] = relationship(back_populates = "favorites")

    review_id: Mapped[int] = mapped_column(ForeignKey("reviews.id"), nullable=True)
    fav_review: Mapped["Reviews"] = relationship(back_populates = "favorites")

    comment_id: Mapped[int] = mapped_column(ForeignKey("comments.id"), nullable=True)
    fav_comment: Mapped["Comments"] = relationship(back_populates = "favorites")

    tag_id: Mapped[int] = mapped_column(ForeignKey("tags.id"), nullable=True)
    tag_user: Mapped["Tags"] = relationship(back_populates = "favorites")

    show_id: Mapped[int] = mapped_column(ForeignKey("shows.id"), nullable=True)
    fav_show: Mapped["Shows"] = relationship(back_populates = "favorites")

    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"), nullable=True)
    fav_movie: Mapped["Movies"] = relationship(back_populates = "favorites")
    

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "review_id": self.review_id,
            "comment_id": self.comment_id,
            "tag_id": self.tag_id,
            "show_id": self.show_id
        }

class Reviews(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    user_name: Mapped[str] = mapped_column(String(120), nullable=False)
    item_type: Mapped[str] = mapped_column(String(520), nullable=False)
    item_id: Mapped[int] = mapped_column(Integer, nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    favorites: Mapped["Favorites"] = relationship(back_populates = "fav_review")
    comments: Mapped[list["Comments"]] = relationship("Comments", back_populates="review", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": self.user_name,
            "item_type": self.item_type,
            "item_id": self.item_id,
            "text": self.text,
            "rating": self.rating,
            "timestamp": self.timestamp,
            "favorites": self.favorites,
            "comments": [c.serialize() for c in self.comments]
        }

    
class Comments(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    review_id: Mapped[int] = mapped_column(ForeignKey('reviews.id'), nullable=False)
    user_name: Mapped[str] = mapped_column(String(120), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    favorites: Mapped["Favorites"] = relationship(back_populates = "fav_comment")
    review: Mapped["Reviews"] = relationship("Reviews", back_populates="comments")

    def serialize(self):
        return {
            "id": self.id,
            "review_id": self.review_id,
            "user_name": self.user_name,
            "text": self.text,
            "date": self.date,
            "favorites": self.favorites
        }

class Tags(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    review_tag: Mapped[str] = mapped_column(String(520), nullable=False)
    comment_tag: Mapped[str] = mapped_column(String(520), nullable=False)
    show_tag: Mapped[str] = mapped_column(String(520), nullable=False)
    favorites: Mapped["Favorites"] = relationship(back_populates = "tag_user")

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "review_tag": self.review_tag,
            "comment_tag": self.comment_tag,
            "show_tag": self.show_tag
        }
    
class Shows(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(520), nullable=True)
    season: Mapped[str] = mapped_column(String(520), nullable=True)
    episode: Mapped[str] = mapped_column(String(520), nullable=True)
    discription: Mapped[str] = mapped_column(String(520), nullable=True)
    rating: Mapped[str] = mapped_column(String(520), nullable=True)
    favorites: Mapped["Favorites"] = relationship(back_populates = "fav_show")
    watch_later: Mapped["Watches"] = relationship(back_populates = "watch_show_later")
    continue_watching: Mapped["Watches"] = relationship(back_populates = "watch_show_again")


    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "season": self.season,
            "episode": self.episode,
            "discription": self.discription,
            "rating": self.rating
        }
    
class Movies(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(520), nullable=True)
    discription: Mapped[str] = mapped_column(String(520), nullable=True)
    rating: Mapped[str] = mapped_column(String(520), nullable=True)
    favorites: Mapped["Favorites"] = relationship(back_populates = "fav_movie")
    watch_movie_later: Mapped["Watches"] = relationship(back_populates = "watch_movie_later")
    continue_watching_movies: Mapped["Watches"] = relationship(back_populates = "watch_movie_again")


    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "discription": self.discription,
            "rating": self.rating
        }
    
class Watches(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    user_name: Mapped[str] = mapped_column(ForeignKey("user.user_name"))
    user_watches: Mapped["User"] = relationship(back_populates = "watches")    

    watch_later_id: Mapped[int] = mapped_column(ForeignKey("shows.id"))
    watch_show_later: Mapped["Shows"] = relationship(back_populates = "watch_later")
    watch_show_again: Mapped["Shows"] = relationship(back_populates = "continue_watching")

    watch_movie_later_id: Mapped[int] = mapped_column(ForeignKey("movies.id"))
    watch_movie_later: Mapped["Movies"] = relationship(back_populates = "watch_movie_later")
    watch_movie_again: Mapped["Movies"] = relationship(back_populates = "continue_watching_movies")
   
    

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "watch_later_id": self.watch_later_id,
            "watch_movie_id": self.watch_later_id,
            
        }
