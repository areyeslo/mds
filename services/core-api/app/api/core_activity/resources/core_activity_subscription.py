from flask_restplus import Resource, reqparse
from flask import request
from werkzeug.exceptions import BadRequest, NotFound

from app.extensions import api
from app.api.utils.access_decorators import requires_role_view_all
from app.api.utils.resources_mixins import UserMixin

from app.api.core_activity.models.core_activity_subscription import CoreActivitySubscription
from app.api.core_activity.models.core_activity_subscription_view import CoreActivitySubscriptionView
from app import auth
from app.api.core_activity.response_models import CORE_ACTIVITY_SUBSCRIPTION, CORE_ACTIVITY_SUBSCRIPTION_VIEW


class CoreActivitySubscriptionListResource(Resource, UserMixin):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument(
        'target_guid',
        type=str,
        help='Entity guid to subscribe to.',
        location='json',
        required=True)
    parser.add_argument(
        'core_activity_object_type_code',
        type=str,
        help='Core entity type to subscribe to.',
        location='json',
        required=True)

    @api.doc(description='Get Core user subscriptions.')
    @requires_role_view_all
    @api.marshal_with(CORE_ACTIVITY_SUBSCRIPTION_VIEW, envelope='records', code=200)
    def get(self):
        core_user = auth.get_core_user()

        if not core_user:
            raise BadRequest('core_user is empty.')

        return CoreActivitySubscriptionView.query.filter_by(
            core_user_guid=core_user.core_user_guid).all()

    @api.expect(parser)
    @api.marshal_with(CORE_ACTIVITY_SUBSCRIPTION, code=201)
    @requires_role_view_all
    @api.doc(description='Subscribes user to an activity associated with the target_guid.')
    def post(self):
        data = self.parser.parse_args()
        core_user = auth.get_core_user()
        target_guid = data.get('target_guid')
        core_activity_object_type_code = data.get('core_activity_object_type_code')

        subscription = CoreActivitySubscription(
            core_user_guid=core_user.core_user_guid,
            target_guid=target_guid,
            core_activity_object_type_code=core_activity_object_type_code)
        subscription.save()

        return subscription


class CoreActivitySubscriptionResource(Resource, UserMixin):
    @api.doc(description='Deletes the mine type provided.')
    @api.marshal_with(CORE_ACTIVITY_SUBSCRIPTION, code=204)
    @requires_role_view_all
    @api.response(204, 'Successfully deleted.')
    def delete(self, target_guid):
        core_user = auth.get_core_user()

        subscription = CoreActivitySubscription.query.filter_by(
            core_user_guid=core_user.core_user_guid, target_guid=target_guid).one_or_none()

        if not subscription:
            raise BadRequest('Subscription you are trying to delete does not exist.')

        subscription.delete()
        return subscription
