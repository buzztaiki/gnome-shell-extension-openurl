const Main = imports.ui.main;
const Search = imports.ui.search;
const Util = imports.misc.util;


function OpenUrlSearchProvider() {
  this._init();
}

OpenUrlSearchProvider.prototype = {
  __proto__: Search.SearchProvider.prototype,

  _init: function() {
    Search.SearchProvider.prototype._init.call(this, 'openurl');
  },

  /**
   * getInitialResultSet:
   * @terms: Array of search terms, treated as logical AND
   *
   * Called when the user first begins a search (most likely
   * therefore a single term of length one or two), or when
   * a new term is added.
   *
   * Should return an array of result identifier strings representing
   * items which match the given search terms.  This
   * is expected to be a substring match on the metadata for a given
   * item.  Ordering of returned results is up to the discretion of the provider,
   * but you should follow these heruistics:
   *
   *  * Put items where the term matches multiple criteria (e.g. name and
   *    description) before single matches
   *  * Put items which match on a prefix before non-prefix substring matches
   *
   * This function should be fast; do not perform unindexed full-text searches
   * or network queries.
   */
  getInitialResultSet: function(terms) {
    return [];
  },

  /**
   * getSubsearchResultSet:
   * @previousResults: Array of item identifiers
   * @newTerms: Updated search terms
   *
   * Called when a search is performed which is a "subsearch" of
   * the previous search; i.e. when every search term has exactly
   * one corresponding term in the previous search which is a prefix
   * of the new term.
   *
   * This allows search providers to only search through the previous
   * result set, rather than possibly performing a full re-query.
   */
  getSubsearchResultSet: function(previousResults, newTerms) {
    if (!newTerms) {
      return [];
    }
    if (newTerms[0].search(/^[a-z]+:\/\/.+/) >= 0) {
      return [newTerms[0]]
    }
    return [];
  },

  /**
   * getResultMeta:
   * @id: Result identifier string
   *
   * Return an object with 'id', 'name', (both strings) and 'createIcon'
   * (function(size) returning a Clutter.Texture) properties which describe
   * the given search result.
   */
  getResultMeta: function(id) {
    let name = id.replace(/^[a-z]+:\/\//, '');
    return {
      'id': id,
      'name': name,
      'createIcon': function(size) {
        return null;
      },
    };
  },

  /**
   * createResultContainer:
   *
   * Search providers may optionally override this to render their
   * results in a custom fashion.  The default implementation
   * will create a vertical list.
   *
   * Returns: An instance of SearchResultDisplay.
   */
  createResultContainerActor: function() {
    return null;
  },

  /**
   * createResultActor:
   * @resultMeta: Object with result metadata
   * @terms: Array of search terms, should be used for highlighting
   *
   * Search providers may optionally override this to render a
   * particular serch result in a custom fashion.  The default
   * implementation will show the icon next to the name.
   *
   * The actor should be an instance of St.Widget, with the style class
   * 'search-result-content'.
   */
  createResultActor: function(resultMeta, terms) {
    return null;
  },

  /**
   * activateResult:
   * @id: Result identifier string
   *
   * Called when the user chooses a given result.
   */
  activateResult: function(id) {
    Util.spawn(['xdg-open', id])
  },
}

function OpenUrlExtension() {
  this._init();
}

OpenUrlExtension.prototype = {
  _init: function() {
    // do nothing.
  },

  enable: function() {
    this._provider = new OpenUrlSearchProvider();
    Main.overview.addSearchProvider(this._provider);
  },

  disable: function() {
    Main.overview.removeSearchProvider(this._provider);
  },
}

function init() {
  return new OpenUrlExtension();
}
