from flask import Blueprint
import json
from models import Conversation, ConversationParty, User, Message
from web.helpers import datetime_to_string
from web.messages import save_message, get_messages
from web.conversations import get_conversations

chat = Blueprint('chat', __name__)

@chat.after_request
def add_header(r):
	r.headers['Access-Control-Allow-Origin'] = '*'
	return r

@chat.route('/conversations')
def get_conversations_tab_data():
	c = get_conversations()
	return json.dumps({'conversations': c})


@chat.route('/conversations/<conversation_id>')
def get_conversation_tab_data(conversation_id):
	return json.dumps({'conversation': get_conversations(conversation_id=conversation_id)})


@chat.route('/conversations/<conversation_id>/messages')
def get_conversation_data(conversation_id):
	return json.dumps({'messages':get_messages(user_id=1, conversation_id=conversation_id)})

@chat.route('/')
def home():
	return 'home'

