'use strict';
angular.module('chatApp').directive('createConversationsModal', ['UserData', 'ModalData', 'HTTPService', 'CallbackUtils', function(UserData, ModalData, HTTPService, CallbackUtils) {

	return {
		restrict: 'E',
		templateUrl: 'views/chat/create-conversations-modal.html',
		link: function(scope, element, attrs){

			var initModal = function(){
				var endpoint = "/conversationees/"
				HTTPService.requests(endpoint).get().$promise.then(function(response) {
					var myId = UserData.getId();
					var conversationees = response.conversationees;
					console.log(response);
					scope.conversationees = [];
					for(var i = 0; i < conversationees.length; i++){
						if (conversationees[i].id !== myId){
							scope.conversationees.push(conversationees[i]);
						}
			    	}
			    }, function(promise) {
			        CallbackUtils.mostrarErros(promise);
			    });
			    scope.groupUsers = [];
			};
			initModal();

			var post = function(conversation){
				var endpoint = "conversations/"
				HTTPService.requests(endpoint).post(conversation).$promise.then(function(response) {
					$('#new-conversation-modal').modal('hide');
			    }, function(promise) {
			        CallbackUtils.mostrarErros(promise);
			    });	
			};

			var createGroupConversation = function(){
				var conversation = {};
				conversation.conversation_type = "group";
				conversation.picture = null;
				conversation.name = scope.groupName;
				conversation.conversationees_list =[];
				for(var i = 0; i <  scope.groupUsers.length; i++){
					conversation.conversationees_list.push(scope.groupUsers[i].id);
				}
				
				post(conversation);
			};

			var createDirectConversation = function(){
				var conversation = {};
				conversation.conversation_type = "direct";
				conversation.picture = null;
				conversation.name = scope.selectedConversationee.name;
				conversation.conversationees_list = []; conversation.conversationees_list.push(scope.selectedConversationee.id);
				
				console.log(conversation);
				post(conversation);
			};

			scope.create = function(){
				if(scope.type === 'group'){
					createGroupConversation();
				}else{
					createDirectConversation();
				}
			};

			scope.addUserToGroup = function(user){
				scope.groupUsers.push(user);
			};

			$('#new-conversation-modal').on('shown.bs.modal', function(){
				scope.type = ModalData.get('type');
			});
		}
	};


}]);