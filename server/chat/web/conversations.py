from models import Conversation, ConversationParty, ConversationType, Photo, User, database
from web.helpers import datetime_to_string
from web.photos import get_user_photo
from peewee import fn

def update_conversation(conversation_id, lasbot_message=None, name=None):
	
	Conversation.update(last_message=last_message, name=name).where(Conversation.id==conversation_id).execute()


def create_conversation(conversation_object):

	c['conversationees_list'] = request.json.get('conversationees_list')

	ct = ConversationType()
	ct.get(ConversationType.name == conversation_object.get('conversation_type'))

	c = Conversation()
	c.name = conversation_object.get('name','')
	c.conversation_type = ct

	p = None
	p_url = conversation_object.get('picture','')
	if p_url:
		p = Photo()
		p.url = p_url

	cps = []

	conversationees_list = list(set(conversation_object.get('conversationees_list',[])))

	for index, conversationee in conversationees_list:
		
		cp = ConversationParty()
		cp.conversation = c
		cp.user = User.get(User.id==conversationee)
		picture = p if p else get_user_photo(index, conversationees_list)
		cps.append(cp)

	with database.transaction():
		c.save()
		if p:
			p.save()
		for cp in cps:
			cp.save()

	return __jsonify_one_conversation(c)


def get_conversation_json(user_id=None, conversation_id=None):
	
	if conversation_id:
		conversations = Conversation.select().where(Conversation.id == conversation_id).first()
	elif user_id:
		conversations = Conversation.select().join(ConversationParty,on=Conversation.id==ConversationParty.conversation).where(ConversationParty.user==user_id)
	else:
		conversations = None
	return __jsonify_conversations(conversations)
		

def __jsonify_conversations(conversations):

		if conversations:
			if hasattr(conversations, '__iter__'):
				json_list = []
				for conversation in conversations:
					json_list.append(__jsonify_one_conversation(conversation))
				return json_list
			else:
				return __jsonify_one_conversation(conversations)
		return None
					

def __jsonify_one_conversation(conversation):

	c = dict()
	lm = dict()

	lm['date'] = datetime_to_string(conversation.last_message.ts) if conversation and conversation.last_message else ''
	lm['text'] = conversation.last_message.display_content if conversation.last_message else ''

	c['id'] = conversation.id if conversation else ''
	c['name'] = conversation.name if conversation and conversation.name else ''
	c['last_message'] = lm

	return c