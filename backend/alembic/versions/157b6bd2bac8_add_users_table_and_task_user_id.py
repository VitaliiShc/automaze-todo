"""add users table and task user_id

Revision ID: 157b6bd2bac8
Revises: bc5fa147d333
Create Date: 2026-07-21 08:51:21.805386

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '157b6bd2bac8'
down_revision: Union[str, Sequence[str], None] = 'bc5fa147d333'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('google_id', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('google_id')
    )
    # batch_alter_table is used instead of plain add_column/create_foreign_key because
    # SQLite cannot ALTER a table to add a foreign key constraint in place; on PostgreSQL
    # this compiles down to a normal ALTER TABLE with no table rebuild.
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=False))
        batch_op.create_index(batch_op.f('ix_tasks_user_id'), ['user_id'], unique=False)
        batch_op.create_foreign_key('fk_tasks_user_id_users', 'users', ['user_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.drop_constraint('fk_tasks_user_id_users', type_='foreignkey')
        batch_op.drop_index(batch_op.f('ix_tasks_user_id'))
        batch_op.drop_column('user_id')
    op.drop_table('users')
