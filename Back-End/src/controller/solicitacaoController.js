const { SolicitationRepository } = require('../repositories/index')
const {
  SolicitationSchema,
  UpdateSolicitationSchema,
} = require('../DTOs/index')
const { PostagensRepository } = require('../repositories/index')
const { UserRepository } = require('../repositories/index')

class SolicitationController {
  async create(req, res, next) {
    try {
      const SolicitationData = SolicitationSchema.parse(req.body);

      if (SolicitationData.type === 'CREATE') {
        if (SolicitationData.entity === 'POSTAGEM') {
          if (!SolicitationData.newData) {
            return next({
              status: 404,
              message: 'Dados de Postagens são requisitados',
            });
          }
          const newPostagem = PostagensSchema.parse(SolicitationData.newData);
          const postagemAlreadyExists = await PostagensRepository.findByTitle(newPostagem.titulo);
          if (postagemAlreadyExists) {
            return next({
              status: 404,
              message: 'Postagem already exists',
            });
          }
        }
      } else if (SolicitationData.type === 'EDIT') {
        if (SolicitationData.entity === 'POSTAGEM') {
          if (!SolicitationData.postagemId) {
            return next({
              status: 404,
              message: 'Postagem ID is required',
            });
          }
          const postagemFound = await PostagensRepository.findById(SolicitationData.postagemId);
          if (!SolicitationData.currentData) {
            return next({
              status: 404,
              message: 'Current postagem data is required',
            });
          }
          PostagensSchema.parse(SolicitationData.currentData);
          if (!postagemFound) {
            return next({
              status: 404,
              message: 'Postagem not found',
            });
          }
          if (!SolicitationData.newData) {
            return next({
              status: 404,
              message: 'New postagem data is required',
            });
          }
          const newPostagem = UpdatePostagensSchema.parse(SolicitationData.newData);
          if (newPostagem.titulo) {
            const postagemAlreadyExists = await PostagensRepository.findByTitle(newPostagem.titulo);
            if (postagemAlreadyExists) {
              return next({
                status: 404,
                message: 'Postagem already exists',
              });
            }
          }
        }
      } else if (SolicitationData.type === 'DELETE') {
        if (SolicitationData.entity === 'POSTAGEM') {
          if (!SolicitationData.postagemId) {
            return next({
              status: 404,
              message: 'Postagem ID is required',
            });
          }
          const postagemFound = await PostagensRepository.findById(SolicitationData.postagemId);
          if (!postagemFound) {
            return next({
              status: 404,
              message: 'Postagem not found',
            });
          }
        }
      }

      const data = {
        type: SolicitationData.type,
        entity: SolicitationData.entity,
        userId: SolicitationData.userId,
        userName: SolicitationData.userName,
        userImage: SolicitationData.userImage,
        newData: JSON.parse(JSON.stringify(SolicitationData.newData)) || {},
        currentData: JSON.parse(JSON.stringify(SolicitationData.currentData)) || {},
        postagemId: SolicitationData.postagemId,
      };
      const result = await SolicitationRepository.create(data);

      return next({
        status: 200,
        message: 'Solicitation created',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const { solicitationId } = req.params;
      const SolicitationData = await SolicitationRepository.findById(solicitationId);
      if (!SolicitationData) {
        return next({
          status: 404,
          message: 'Solicitation not found',
        });
      }

      if (SolicitationData.type === 'CREATE') {
        if (SolicitationData.entity === 'POSTAGEM') {
          if (!SolicitationData.newData) {
            return next({
              status: 404,
              message: 'Postagem data is required',
            });
          }
          const newPostagem = PostagensSchema.parse(SolicitationData.newData);
          const postagemAlreadyExists = await PostagensRepository.findByTitle(newPostagem.titulo);
          if (postagemAlreadyExists) {
            return next({
              status: 404,
              message: 'Postagem already exists',
            });
          }
          const data = await PostagensRepository.create(newPostagem);
          await SolicitationRepository.delete(SolicitationData.id);
          return next({
            status: 200,
            message: 'Postagem created',
            data,
          });
        }
      }
      if (SolicitationData.type === 'EDIT') {
        if (SolicitationData.entity === 'POSTAGEM') {
          if (!SolicitationData.postagemId) {
            return next({
              status: 404,
              message: 'Postagem ID is required',
            });
          }
          const postagemFound = await PostagensRepository.findById(SolicitationData.postagemId);
          if (!SolicitationData.currentData) {
            return next({
              status: 404,
              message: 'Current postagem data is required',
            });
          }
          PostagensSchema.parse(SolicitationData.currentData);
          if (!postagemFound) {
            return next({
              status: 404,
              message: 'Postagem not found',
            });
          }
          if (!SolicitationData.newData) {
            return next({
              status: 404,
              message: 'New postagem data is required',
            });
          }
          const newPostagem = UpdatePostagensSchema.parse(SolicitationData.newData);
          if (newPostagem.titulo) {
            const postagemAlreadyExists = await PostagensRepository.findByTitle(newPostagem.titulo);
            if (postagemAlreadyExists) {
              return next({
                status: 404,
                message: 'Postagem already exists',
              });
            }
          }
          const data = await PostagensRepository.update(SolicitationData.postagemId, newPostagem);
          await SolicitationRepository.delete(SolicitationData.id);
          return next({
            status: 200,
            message: 'Postagem updated',
            data,
          });
        }
      }
      if (SolicitationData.type === 'DELETE') {
        if (SolicitationData.entity === 'POSTAGEM') {
          if (!SolicitationData.postagemId) {
            return next({
              status: 404,
              message: 'Postagem ID is required',
            });
          }
          const postagemFound = await PostagensRepository.findById(SolicitationData.postagemId);
          if (!postagemFound) {
            return next({
              status: 404,
              message: 'Postagem not found',
            });
          }
          const data = await PostagensRepository.delete(SolicitationData.postagemId);
          await SolicitationRepository.delete(SolicitationData.id);
          return next({
            status: 200,
            message: 'Postagem deleted',
            data,
          });
        }
      }
      return next({
        status: 200,
        message: 'Solicitation approved',
      });
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const solicitations = await SolicitationRepository.findAll();
      res.locals = {
        status: 200,
        message: 'Solicitations found',
        data: solicitations,
      };
      return next();
    } catch (error) {
      return next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { solicitationId } = req.params;
      const solicitation = await SolicitationRepository.findById(solicitationId);
      if (!solicitation) {
        res.locals = {
          status: 404,
          message: 'Solicitation not found',
        };
        return next();
      }
      res.locals = {
        status: 200,
        message: 'Solicitation found',
        data: solicitation,
      };
      return next();
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { solicitationId } = req.params;
      const solicitationData = UpdateSolicitationSchema.parse(req.body);
      const solicitationFound = await SolicitationRepository.findById(solicitationId);
      if (!solicitationFound) {
        res.locals = {
          status: 404,
          message: 'Solicitation not found',
        };
        return next();
      }
      const updateData = {
        type: solicitationData.type,
        entity: solicitationData.entity,
        userId: solicitationData.userId,
        userName: solicitationData.userName,
        userImage: solicitationData.userImage,
        newData: JSON.parse(JSON.stringify(solicitationData.newData)) || {},
        currentData: JSON.parse(JSON.stringify(solicitationData.currentData)) || {},
        postagemId: solicitationData.postagemId,
      };
      await SolicitationRepository.update(solicitationId, updateData);
      res.locals = {
        status: 200,
        message: 'Solicitation updated',
      };
      return next();
    } catch (error) {
      return next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { solicitationId } = req.params;
      const solicitationFound = await SolicitationRepository.findById(solicitationId);
      if (!solicitationFound) {
        res.locals = {
          status: 404,
          message: 'Solicitation not found',
        };
        return next();
      }
      await SolicitationRepository.delete(solicitationId);
      res.locals = {
        status: 200,
        message: 'Solicitation deleted',
      };
      return next();
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new SolicitationController();
